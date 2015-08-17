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
            'drag_to_resize.user.js',
            'chat.js',
            'notification.js'
        ])
        .scripts(['indexdbwrapper.js'], 'public/indexdbwrapper.js')
        .scripts(['service-worker.js'], 'public/service-worker.js')
        .scripts(['jquery.form.js'], 'public/js/jquery.form.js')
        .scripts(['bootstrap-switch.js'], 'public/js/bootstrap-switch.js');
});
