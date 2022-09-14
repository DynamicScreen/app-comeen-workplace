<?php

namespace ComeenPlay\ComeenWorkplace\RoomBooking;

use ComeenPlay\SdkPhp\Handlers\SlideHandler;
use ComeenPlay\SdkPhp\Interfaces\ISlide;
use ComeenPlay\SdkPhp\Interfaces\IDisplay;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;

use ComeenPlay\ComeenWorkplace\RoomBooking\Helper\CheckError;
use ComeenPlay\ComeenWorkplace\RoomBooking\Action\GetMeetingRoomData;
use ComeenPlay\SdkPhp\Modules\DisplayModule;
use Arr;

class RoomBookingHandler extends SlideHandler
{
    public function provideRemoteMethods()
    {
        $this->addRemoteMethod('validate-room-setup', function ($parameters, $details) {
            /** @var DisplayModule $display */
            $display = Arr::get($details, 'display');

            $display->setMetadata("comeen::meeting_room", Arr::get($parameters, 'meeting_room_id'));

            return $parameters;
        });
    }

    public function fetch(ISlide $slide, IDisplay $display): void
    {
        $driver = $this->getAuthProvider($slide->getAccounts());
        if ($driver == null) return;

        $meeting_room_id = $display->getMetadata("comeen::meeting_room", null) ?? null;

        if (!$meeting_room_id) {
            // We agreed that the interval is 30 minutes, as well as the update Comeen slide job
            $expiration = Carbon::now();
            $cache_key = "dynamicscreen.comeen::meeting-room::";

            $data = app('cache')->remember($cache_key, $expiration, function () use ($display, $driver, $meeting_room_id, $slide) {
                $buildings = $driver->getBuildingsList();
                $meeting_rooms = $driver->getMeetingRoomsList();

                // Check if there is any error
                $errorHandle = new CheckError([$buildings, $meeting_rooms]);
                if ($errorHandle->hasError()) {
                    return $errorHandle->getError();
                }

                $buildings = collect($buildings)->map(function ($building) {
                    return [
                        "id" => $building->id,
                        "name" => $building->name,
                        "address" => $building->address,
                    ];
                });

                $no_building_rooms = collect();

                $meeting_rooms = collect($meeting_rooms)->map(function ($meeting_room) use ($no_building_rooms) {
                    if (!isset($meeting_room->building)) {
                        $no_building_rooms->push([
                            "id" => $meeting_room->id,
                            "name" => $meeting_room->name,
                        ]);
                        return null;
                    }
                    return [
                        "id" => $meeting_room->id,
                        "name" => $meeting_room->name,
                        "building_id" => $meeting_room->building->id
                    ];
                })->filter();

                return [
                    "display_id" => $display->getId(),
                    "clock_format" => $display->getClockFormat(),
                    "buildings" => $buildings,
                    "meeting_rooms" => $meeting_rooms,
                    "no_building_rooms" => $no_building_rooms,
                    "hasMetadata" => false,
                ];
            });

            $this->addSlide($data);
        } else {
            // We agreed that the interval is 30 minutes, as well as the update Comeen slide job
            $expiration = Carbon::now()->addMinute(30);
            $cache_key = "dynamicscreen.comeen::meeting-room::{$meeting_room_id}";

            $data = app('cache')->remember($cache_key, $expiration, function () use ($driver, $display, $meeting_room_id, $slide) {
                $actionMeetingRoom = new GetMeetingRoomData($meeting_room_id, $driver);
                return $actionMeetingRoom->call();
            });

            // Removing __accounts field from slide options to get only the display/action options, and convert them into value boolean
            $slide_options = collect($slide->getOptions())->forget("__accounts")->map(function ($item) {
                return boolval($item);
            })->toArray();

            $data["clock_format"] = $display->getClockFormat();
            $data["slide_options"] = $slide_options;

            $this->addSlide($data);
        }
    }

    public function getValidations($options = null): array
    {
        return [
            'rules' => [
                // 'url' => ['required']
            ],
            'messages' => [
                // 'url.required' => ""
            ],
        ];
    }
}
