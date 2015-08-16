<?php

namespace App\Http\Controllers;

use App\SubscriptionNotification;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        if (!preg_match('/.+\/(.+)/', $request->input('endpoint'), $matches)) {
            return "error";
        }

        $subscription = new SubscriptionNotification([
            'subscription_id' => $matches[1]
        ]);

        $subscription->save();

        return "success";
    }

}
