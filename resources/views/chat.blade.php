@extends('layout.default')

@section('content')
    <h1>ChatApp</h1>
    <label for="push-notification">Enable Push Messages</label>
    <input type="checkbox" class="js-push-button" name="push-notification" disabled>

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
    <script>
        $("[name='push-notification']").bootstrapSwitch();
    </script>
@endsection