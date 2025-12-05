<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'description',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'total_units',
        'purchase_price',
        'purchase_date',
        'monthly_rent',
        'amenities',
        'images',
        'status',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'purchase_date' => 'date',
        'purchase_price' => 'decimal:2',
        'monthly_rent' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->postal_code}";
    }

    public function getFormattedPurchasePriceAttribute(): string
    {
        return $this->purchase_price ? '$' . number_format($this->purchase_price, 2) : 'N/A';
    }

    public function getFormattedMonthlyRentAttribute(): string
    {
        return $this->monthly_rent ? '$' . number_format($this->monthly_rent, 2) : 'N/A';
    }
}
