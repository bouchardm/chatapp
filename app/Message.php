<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Queue\SerializesModels;

class Message extends Model
{
    use SerializesModels;

    protected $fillable = ['name', 'text'];
}
