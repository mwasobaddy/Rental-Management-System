<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_tier_id',
        'status',
        'billing_cycle',
        'amount_paid',
        'trial_ends_at',
        'current_period_starts_at',
        'current_period_ends_at',
        'cancelled_at',
        'payment_method',
        'payment_id',
        'usage_stats',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'trial_ends_at' => 'datetime',
        'current_period_starts_at' => 'datetime',
        'current_period_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'usage_stats' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscriptionTier(): BelongsTo
    {
        return $this->belongsTo(SubscriptionTier::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && 
               $this->current_period_ends_at && 
               $this->current_period_ends_at->isFuture();
    }

    public function isOnTrial(): bool
    {
        return $this->status === 'trial' && 
               $this->trial_ends_at && 
               $this->trial_ends_at->isFuture();
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired' || 
               ($this->current_period_ends_at && $this->current_period_ends_at->isPast());
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled' || !is_null($this->cancelled_at);
    }

    public function hasAccess(): bool
    {
        return $this->isActive() || $this->isOnTrial();
    }

    public function getDaysUntilExpiry(): int
    {
        if ($this->isOnTrial()) {
            return $this->trial_ends_at->diffInDays(now(), false);
        }

        if ($this->isActive()) {
            return $this->current_period_ends_at->diffInDays(now(), false);
        }

        return 0;
    }

    public function getRemainingProperties(): ?int
    {
        if ($this->subscriptionTier->hasUnlimitedProperties()) {
            return null; // Unlimited
        }
        // Fallback to using the actual properties count if usage_stats hasn't been updated
        $usedProperties = $this->getUsageStat('properties_count', $this->user?->properties()->count() ?? 0);
        return max(0, $this->subscriptionTier->max_properties - $usedProperties);
    }

    public function getRemainingUnits(): ?int
    {
        if ($this->subscriptionTier->hasUnlimitedUnits()) {
            return null; // Unlimited
        }
        // Fallback to using the aggregated units count across user's properties if usage_stats hasn't been updated
        $usedUnits = $this->getUsageStat('units_count', $this->user?->properties()->sum('total_units') ?? 0);
        return max(0, $this->subscriptionTier->max_units - $usedUnits);
    }

    public function getRemainingTenants(): ?int
    {
        if ($this->subscriptionTier->hasUnlimitedTenants()) {
            return null; // Unlimited
        }

        $usedTenants = $this->getUsageStat('tenants_count', 0);
        return max(0, $this->subscriptionTier->max_tenants - $usedTenants);
    }

    public function canAddProperty(): bool
    {
        $remaining = $this->getRemainingProperties();
        return is_null($remaining) || $remaining > 0;
    }

    public function canAddUnit(): bool
    {
        $remaining = $this->getRemainingUnits();
        return is_null($remaining) || $remaining > 0;
    }

    public function canAddTenant(): bool
    {
        $remaining = $this->getRemainingTenants();
        return is_null($remaining) || $remaining > 0;
    }

    public function updateUsageStats(array $stats): void
    {
        $currentStats = $this->usage_stats ?? [];
        $this->update([
            'usage_stats' => array_merge($currentStats, $stats)
        ]);
    }

    public function getUsageStat(string $key, $default = null)
    {
        return data_get($this->usage_stats, $key, $default);
    }

    public function extend(int $days): void
    {
        if ($this->isOnTrial()) {
            $this->update([
                'trial_ends_at' => $this->trial_ends_at->addDays($days)
            ]);
        } elseif ($this->isActive()) {
            $this->update([
                'current_period_ends_at' => $this->current_period_ends_at->addDays($days)
            ]);
        }
    }

    public function cancel(): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }

    public function reactivate(): void
    {
        $this->update([
            'status' => 'active',
            'cancelled_at' => null,
        ]);
    }

    public static function createTrial(int $userId, int $tierId, int $trialDays = 14): self
    {
        return static::create([
            'user_id' => $userId,
            'subscription_tier_id' => $tierId,
            'status' => 'trial',
            'trial_ends_at' => now()->addDays($trialDays),
        ]);
    }
}
