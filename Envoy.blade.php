@servers(['web' => 'root@bouchardm.com'])

@task('deploy', ['on' => 'web'])
    cd /www/chatapp/
    sudo -u www-data git pull
    sudo -u www-data composer install
    sudo -u www-data php artisan migrate
@endtask