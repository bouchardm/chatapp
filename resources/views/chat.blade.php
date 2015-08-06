@extends('layout.default')

@section('content')
    <h1>ChatApp</h1>
    <ul id="messages">
        <li v-repeat="message: messages">@{{ message.message }}</li>
    </ul>

    <form action="/send" method="POST" id="message-form">
        {!! csrf_field() !!}

        <label for="message">Message:</label>
        <input type="text" name="message" id="message-field">
        <input type="submit" value="Envoyer">
    </form>
@endsection

@section('script')
    <script src="https://js.pusher.com/2.2/pusher.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/0.12.9/vue.js"></script>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="http://malsup.github.com/jquery.form.js"></script>

    <script>
        (function () {
            new Vue({
                el: '#messages',
                data: {
                    messages: []
                },
                ready: function() {
                    var pusher = new Pusher('d85a864817e808027400', {
                        encrypted: true
                    });
                    var channel = pusher.subscribe('messages');
                    channel.bind('App\\Events\\MessageSent', this.addMessage);
                },
                methods: {
                    addMessage: function (message) {
                        this.messages.push(message);
                    }
                }
            });
            $('#message-form').submit(function() {
                // submit the form
                $(this).ajaxSubmit();
                $(this).clearForm();
                $('#message-field').focus();
                // return false to prevent normal browser submit and page navigation
                return false;
            });
        })();
    </script>
@endsection