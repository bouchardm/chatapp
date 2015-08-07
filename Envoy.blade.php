@servers(['web' => 'root@bouchardm.com'])

@task('deploy', ['on' => 'web'])
    cd /www/chatapp/
    git pull
    php artisan migrate
@endtask