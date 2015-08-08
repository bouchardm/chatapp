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
        },
        isImgLink: function(text) {
            return(text.match(/\.(jpeg|jpg|gif|png)$/) != null);
        },
        makeImageZoomable: function(img) {
            imageData[img.path[0]]         = {};
            imageData[img.path[0]].resized = false;
            img.path[0].dragToResizeId = img.path[0];
            makeImageZoomable(img.path[0]);
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