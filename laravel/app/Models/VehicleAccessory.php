<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VehicleAccessory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'condition',
        'expiration_date',
        'vehicle_id',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}