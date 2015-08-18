var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |

 */

elixir(function(mix) {
    mix.sass('app.scss')
        .styles(['bootstrap-switch.css'], 'public/css/bootstrap-switch.css')
        .scripts([
            'pusher/pusher.min.js',
            'vue/vue.js',
            'vue/vue-resource.min.js',
            'jquery/jquery-2.1.4.min.js',
            'jquery/jquery.form.js',
            'drag_to_resize.user.js',
            'bootstrap/bootstrap-switch.js',

            'chat.js',
            'notification.js'
        ])
        .scripts(['indexdbwrapper.js'], 'public/indexdbwrapper.js')
        .scripts(['service-worker.js'], 'public/service-worker.js')
});
