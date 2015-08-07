@extends('layout.default')

@section('content')
    <h1>ChatApp</h1>
    <div id="messages">
        <div class="row">
            <div class="col-sm-2 text-right"><strong>Nom</strong></div>
            <div class="col-sm-10 text-left"><strong>Message</strong></div>
            <hr>
        </div>
        <div v-repeat="message: messages" class="row">
            <div class="col-sm-2 text-right">@{{ message.name }}</div>
            <div class="col-sm-10 text-left">@{{ message.text }}</div>
            <hr>
        </div>
        <form action="/send" method="POST" id="message-form" class="form-inline">
            <div class="form-group">
                {!! csrf_field() !!}

                <label for="name">Nom:</label>
                <input type="text" name="name" id="name-field" class="form-control">

                <label for="message">Message:</label>
                <input type="text" name="message" id="message-field" class="form-control">
            </div>
            <input type="submit" value="Envoyer" class="btn btn-primary">
            <a v-on="click: deleteAll" class="btn btn-danger" id="delete-all">Tout supprimer!</a>
        </form>
    </div>
@endsection

@section('script')
    <script src="https://js.pusher.com/2.2/pusher.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/0.12.9/vue.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue-resource/0.1.11/vue-resource.min.js"></script>
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
                    this.setupPusher();
                    this.getMessages();
                },
                methods: {
                    setupPusher: function() {
                        var pusher = new Pusher('d85a864817e808027400', {
                            encrypted: true
                        });
                        var channel = pusher.subscribe('messages');
                        channel.bind('App\\Events\\MessageSent', this.addMessage);
                    },
                    addMessage: function(message) {
                        this.messages.push(message.message);
                    },
                    getMessages: function() {
                        this.$http.get('/messages', function(messages) {
                            this.$set('messages', messages);
                        });
                    },
                    deleteAll: function(e) {
                        this.$http.get('/messages/clean', function(messages) {
                            this.messages = []
                        });
                        e.preventDefault();
                    }
                }
            });


            $('#message-form').submit(function() {
                // submit the form
                $(this).ajaxSubmit();
                $('#message-form #message-field').clearFields();
                $('#message-field').focus();
                // return false to prevent normal browser submit and page navigation
                return false;
            });

            $('#message-field').focus();
        })();
    </script>
@endsection