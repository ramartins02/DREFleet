<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Kid;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'status',
        'user_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function phone(): HasOne
    {
        return $this->hasOne(Driver::class);
    }

    //TECHNICIAN-KID RELATION
    //TECHNICIAN DOESN'T NEED A SEPARATE TABLE FROM USERS BECAUSE, UNLIKE THE DRIVERS, IT DOESN'T HAVE ANY SPECIFIC ATTRIBUTES
    public function kids(): BelongsToMany
    {
        return $this->belongsToMany(Kid::class)->withPivot('priority')->withTimestamps();
    }

}
