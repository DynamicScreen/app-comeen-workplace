<?php

namespace ComeenPlay\ComeenWorkplace\RoomBooking\Action;

use Illuminate\Support\Facades\URL;

use ComeenPlay\ComeenWorkplace\RoomBooking\Helper\CheckError;

class GetMeetingRoomData
{

    private $account;
    private $meeting_room_id;

    public function __construct($meeting_room_id, $driver)
    {
        $this->driver = $driver;
        $this->meeting_room_id = $meeting_room_id;
    }

    public function call()
    {
        $driver = $this->driver;
        $meeting_room = $driver->getMeetingRoom($this->meeting_room_id);
        $appointments = $driver->getMeetingRoomAppointments($this->meeting_room_id);

        // Check if there is any error
        $errorHandle = new CheckError([$meeting_room, $appointments]);
        if ($errorHandle->hasError()) {
            return $errorHandle->getError();
        }

        // Else continue to process
        $appointments = collect($appointments)->map(function ($appointment) {
            $meeting_room_obj = collect($appointment->meeting_rooms)->firstWhere("id", $this->meeting_room_id);

//            dd(optional(optional($meeting_room_obj)->booking)->id);

            return [
                "id" => $appointment->id,
                "booking_id" => optional(optional($meeting_room_obj)->booking)->id,
                "meeting_room_status" => optional($meeting_room_obj)->state,
                "start_time" => $appointment->start_datetime,
                "end_time" => $appointment->end_datetime,
                "topic" => $this->removeEmojis($appointment->topic),
                "organizer" => $appointment->organizer->full_name,
                "organizer_email" => $appointment->organizer->email,
                "attendees" => collect($appointment->attendees)->pluck('email', 'id')->toArray(),
            ];
        })->sortBy('start_time')->values()->toArray();

        return [
            "meeting_room_id" => $this->meeting_room_id,
            "meeting_room_building_name" => $meeting_room->building->name ?? null,
            "floor" => $meeting_room->floor,
            "meeting_room_name" => $meeting_room->name,
            "appointments" => $appointments,
            "hasMetadata" => true,
            // "book_meeting_room_signed_url" => URL::signedRoute('dynamicscreen.comeen.book-meeting-room', ['account_id' => $this->account->id, "meeting_room_id" => $meeting_room->id]),
            // "check_in_meeting_signed_url" => URL::signedRoute('dynamicscreen.comeen.check-in-action', ['account_id' => $this->account->id]),
            // "check_out_meeting_signed_url" => URL::signedRoute('dynamicscreen.comeen.check-out-action', ['account_id' => $this->account->id]),
            // "webhook_update_display" => URL::signedRoute('dynamicscreen.comeen.webhook-calendar-sync', ['space_id' => $this->account->space->id, "account_id" => $this->account->id])
        ];
    }

    private function removeEmojis($string) {
        return preg_replace('([*#0-9](>\\xEF\\xB8\\x8F)?\\xE2\\x83\\xA3|\\xC2[\\xA9\\xAE]|\\xE2..(\\xF0\\x9F\\x8F[\\xBB-\\xBF])?(?>\\xEF\\xB8\\x8F)?|\\xE3(?>\\x80[\\xB0\\xBD]|\\x8A[\\x97\\x99])(?>\\xEF\\xB8\\x8F)?|\\xF0\\x9F(?>[\\x80-\\x86].(?>\\xEF\\xB8\\x8F)?|\\x87.\\xF0\\x9F\\x87.|..(\\xF0\\x9F\\x8F[\\xBB-\\xBF])?|(((?<zwj>\\xE2\\x80\\x8D)\\xE2\\x9D\\xA4\\xEF\\xB8\\x8F\k<zwj>\\xF0\\x9F..(\k<zwj>\\xF0\\x9F\\x91.)?|(\\xE2\\x80\\x8D\\xF0\\x9F\\x91.){2,3}))?))',
            "",
            $string);
    }

}
