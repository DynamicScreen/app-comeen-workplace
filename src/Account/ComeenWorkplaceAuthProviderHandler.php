<?php


namespace ComeenPlay\ComeenWorkplace\Account;

use ComeenPlay\SdkPhp\Interfaces\IModule;
use ComeenPlay\SdkPhp\Handlers\OAuthProviderHandler;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use GuzzleHttp\Client;
use Carbon\Carbon;

class ComeenWorkplaceAuthProviderHandler extends OAuthProviderHandler
{
    protected static string $provider = 'comeen-workplace';

    public function __construct(IModule $module, $config = null)
    {
        parent::__construct($module, $config);
    }

    public function provideData($settings = [])
    {
        $this->addData('me', fn () => $this->getUserInfos());
        $this->addData('test-auth', fn () => $this->testConnection());
    }

    public function testConnection($config = null)
    {
        $config = $config ?? $this->default_config;

        try {
            $this->getUserInfos();
            return response('', 200);
        } catch (\Exception $e) {
            return response('Connection failed: '. $e->getMessage(), 403);
        }
    }

    public function getUserInfos($options = null)
    {
        $client = $this->getClient();
        $this->refreshToken($options);

        $response = $client->get('/api/v1/me.json', [
            'headers' => [
                'Authorization' => "{$options['token_type']} {$options['access_token']}"
            ]
        ]);


        return json_decode($response->getBody()->getContents());
    }

    public function signin($callbackUrl = null)
    {
        return $this->authorizationUrl();

    }

    public function callback($request, $redirectUrl = null)
    {
        $code = $request->input('code');

        $tokenPayload = $this->exchangeAuthCode($code);

        $data = $this->processOptions($tokenPayload);
        $dataStr = json_encode($data);

        return redirect()->away($redirectUrl ."&data=$dataStr");
    }

    public function needsRefresh($options)
    {
        $expiration = Carbon::createFromTimestamp($options['created_at'])->addSeconds($options['expires_in']);

        return $expiration->isPast();
    }

    public function refreshToken($options = null)
    {
        if (!$this->needsRefresh($options)) {
            return $options;
        }

        $client = $this->getClient();

        $response = $client->post("/oauth/token", [
            'json' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $options['refresh_token'],
                'client_id' => config('services.comeen.client_id'),
            ]
        ]);
        return collect(json_decode($response->getBody()->getContents()));
    }

    private function getClient()
    {
        return new Client([
            'base_uri' => config('services.comeen.api_url')
        ]);
    }

    private function authorizationUrl(string $state = null)
    {
        $authBaseUrl = config('services.comeen.auth_url');
        $scope = join(' ', config('services.comeen.auth_scopes'));
        $clientId = config('services.comeen.client_id');
        $redirectUri = route('api.oauth.callback');

        $authUrl = "$authBaseUrl?client_id=$clientId&scope=$scope&redirect_uri=$redirectUri";

        if ($state) {
            $authUrl .= "&state=$state";
        }

        return $authUrl;
    }

    private function exchangeAuthCode(string $code)
    {
        $client = $this->getClient();

        $response = $client->post("/oauth/token", [
            'json' => [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => route('api.oauth.callback'),
                'client_id' => config('services.comeen.client_id'),
            ]
        ]);

        return json_decode($response->getBody()->getContents());
    }

    // METHODS

    public function getBuildingsList($config = null) {
        $config = $config ?? $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        $uuid = $this->getUserInfos($config)->space->uuid;

        try {
            $response = $client->get("/api/v1/spaces/$uuid/buildings.json", [
                'headers' => [
                    'Authorization' => "{$config['token_type']} {$config['access_token']}"
                ]
            ]);

            return json_decode($response->getBody()->getContents());
        } catch (\Exception $e) {
            return [
                'code' => $e->getCode(),
                'error' => 'error_building_access',
            ];
        }
    }

    public function getMeetingRoomsList($config = null) {
        $config = $config ?? $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        $uuid = $this->getUserInfos($config)->space->uuid;

        try {
            $response = $client->get("/api/v1/spaces/$uuid/meeting_rooms.json", [
                'headers' => [
                    'Authorization' => "{$config['token_type']} {$config['access_token']}"
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch (\Exception $e) {
            return [
                'code' => $e->getCode(),
                'error' => 'error_meeting_rooms_access',
            ];
        }
    }

    public function getMeetingRoom($meeting_room_id)
    {
        $config = $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        try {
            $response = $client->get("/api/v1/meeting_rooms/$meeting_room_id.json", [
                'headers' => [
                    'Authorization' => "{$config['token_type']} {$config['access_token']}"
                ]
            ]);
            return json_decode($response->getBody()->getContents());
        } catch(\Exception $e) {
            return [
                'code' => $e->getCode(),
                'error' => 'error_meeting_room_access',
            ];
        }
    }

    public function getMeetingRoomAppointments($meeting_room_id)
    {
        $config = $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        try {
            $response = $client->get("/api/v1/meeting_rooms/$meeting_room_id/appointments.json", [
                'headers' => [
                    'Authorization' => "{$config['token_type']} {$config['access_token']}"
                ]
            ]);

            return json_decode($response->getBody()->getContents());
        } catch (\Exception $e) {
            return [
                'code' => $e->getCode(),
                'error' => 'error_appointments_access',
            ];
        }

    }

    public function checkIn($booking_id) {
        $config = $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        $response = $client->post("/api/v1/meeting_room_bookings/$booking_id/checkin.json", [
            'headers' => [
                'Authorization' => "{$config['token_type']} {$config['access_token']}"
            ]
        ]);

        return $response;
    }

    public function releaseMeetingRoom($booking_id) {
        $config = $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        $response = $client->post("/api/v1/meeting_room_bookings/$booking_id/release.json", [
            'headers' => [
                'Authorization' => "{$config['token_type']} {$config['access_token']}"
            ]
        ]);

        return $response;
    }

    public function bookMeetingRoom($meeting_room_id, $title, $description, $date_start, $date_end)
    {
        $config = $this->default_config;

        $client = $this->getClient();
        $config = $this->refreshToken($config);

        $response = $client->post("/api/v1/meeting_rooms/$meeting_room_id/create_event.json", [
            'headers' => [
                'Authorization' => "{$config['token_type']} {$config['access_token']}"
            ],
            'json' => [
                "title" => $title,
                "description" => $description,
                "date_start" => $date_start,
                "date_end" => $date_end,
                "extended_properties" => [
                    "from_comeen" => true
                ]
            ]
        ]);

        return json_decode($response->getBody()->getContents());
    }
}
