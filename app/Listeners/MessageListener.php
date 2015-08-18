<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Message;
use App\SubscriptionNotification;
use Davibennun\LaravelPushNotification\Facades\PushNotification;

class MessageListener
{
    /**
     * Create the event listener.
     *
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  MessageSent  $event
     * @return void
     */
    public function handle(MessageSent $event)
    {
        $subscriptions = SubscriptionNotification::all();
        $message = Message::getRestoredPropertyValue($event->message);
        foreach ($subscriptions as $subscription) {
            $registration_id = $subscription->subscription_id;
            PushNotification::app('appNameAndroid')
                ->to($registration_id)
                ->send($message->text);
        }

        echo "success";
    }
}
