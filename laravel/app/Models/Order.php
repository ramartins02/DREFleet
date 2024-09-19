<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'begin_address',
        'end_address',
        'begin_date',
        'end_date',
        'begin_coordinates',
        'end_coordinates',
        'trajectory',
        'vehicle_id',
        'driver_id',
        'technician_id',

        'manager_id',
        'approved_date',
    ];

    protected $casts = [
        'end_coordinates' => Point::class,
        'begin_coordinates' => Point::class,
    ];
    
}