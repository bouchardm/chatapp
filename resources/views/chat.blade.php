@extends('layout.default')

@section('content')
    <h1>ChatApp</h1>
    <button class="js-push-button" disabled>
        Enable Push Messages
    </button>
    <div id="messages">
        <div class="row">
            <div class="col-lg-2 text-left"><strong>Nom</strong></div>
            <div class="col-lg-10 text-left"><strong>Message</strong></div>
            <hr>
        </div>
        <div v-repeat="message: messages" class="row">
            <hr>
            <div class="col-lg-2 text-left">@{{ message.name }}</div>
            <div class="col-lg-10 text-left">
                <img src="@{{ message.text }}" alt="#" v-if="isImgLink(message.text)" v-on="load: makeImageZoomable"/>
                <p>@{{ message.text }}</p>
            </div>
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
    <script src="https://malsup.github.com/jquery.form.js"></script>
    <script src="js/all.js"></script>
@endsection