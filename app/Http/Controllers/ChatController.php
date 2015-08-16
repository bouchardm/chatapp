<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;
use App\SubscriptionNotification;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('chat');
    }

    public function send()
    {
        $newMessage = new Message();
        $newMessage->name = Input::get('name');
        $newMessage->text = Input::get('message');
        $newMessage->save();

        event(new MessageSent($newMessage));


        // TEST
        $subscriptions = SubscriptionNotification::all();

        foreach ($subscriptions as $subscription) {
            $registration_id = $subscription->subscription_id;
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://android.googleapis.com/gcm/send",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "registration_id={$registration_id}&sender_id=808258000549",
                CURLOPT_HTTPHEADER => array(
                    "authorization: key=AIzaSyB6mBjy5NkpcHDbfNFz76Wb16P6-WiYcbQ"
                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                echo "cURL Error #:" . $err;
            } else {
                echo $response;
            }
        }
    }

    public function messages() {
        return Message::all();
    }

    public function messagesClean() {
        return Message::all()->each(function($message) {
            $message->forceDelete();
        });
    }
}
