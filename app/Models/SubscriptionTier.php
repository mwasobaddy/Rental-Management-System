<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionTier extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'max_properties',
        'max_units',
        'max_tenants',
        'features',
        'is_popular',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function userSubscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function getFormattedPriceMonthlyAttribute(): string
    {
        return '$' . number_format($this->price_monthly, 2);
    }

    public function getFormattedPriceYearlyAttribute(): string
    {
        return $this->price_yearly ? '$' . number_format($this->price_yearly, 2) : null;
    }

    public function getYearlySavingsAttribute(): ?string
    {
        if (!$this->price_yearly) {
            return null;
        }
        
        $monthlyTotal = $this->price_monthly * 12;
        $savings = $monthlyTotal - $this->price_yearly;
        $percentage = round(($savings / $monthlyTotal) * 100);
        
        return "Save {$percentage}% ($" . number_format($savings, 2) . ")";
    }

    public function hasUnlimitedProperties(): bool
    {
        return is_null($this->max_properties);
    }

    public function hasUnlimitedUnits(): bool
    {
        return is_null($this->max_units);
    }

    public function hasUnlimitedTenants(): bool
    {
        return is_null($this->max_tenants);
    }

    public static function getActiveOrderedTiers()
    {
        return static::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('price_monthly')
            ->get();
    }

    public static function findBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->first();
    }
}
