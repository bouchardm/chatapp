<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;

use App\Http\Requests;
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
