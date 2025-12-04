<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
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
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(UserSubscription::class)
            ->where('status', 'active')
            ->orWhere(function ($query) {
                $query->where('status', 'trial')
                      ->where('trial_ends_at', '>', now());
            })
            ->latest();
    }

    public function currentSubscription(): ?UserSubscription
    {
        return $this->activeSubscription;
    }

    public function hasActiveSubscription(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->hasAccess();
    }

    public function isOnTrial(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->isOnTrial();
    }

    public function hasExpiredSubscription(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->isExpired();
    }

    public function canAccessDashboard(): bool
    {
        // Super admins always have access
        if ($this->hasRole('super-admin')) {
            return true;
        }

        // Landlords need active subscription
        if ($this->hasRole('landlord')) {
            return $this->hasActiveSubscription();
        }

        // Other roles (property-manager, assistant) have access based on their landlord's subscription
        return true; // For now, allow others. You can customize this logic.
    }

    public function getSubscriptionStatus(): string
    {
        if (!$this->hasRole('landlord')) {
            return 'not_applicable';
        }

        $subscription = $this->activeSubscription;

        if (!$subscription) {
            return 'no_subscription';
        }

        if ($subscription->isOnTrial()) {
            return 'trial';
        }

        if ($subscription->isActive()) {
            return 'active';
        }

        if ($subscription->isExpired()) {
            return 'expired';
        }

        return 'inactive';
    }

    public function requiresSubscription(): bool
    {
        return $this->hasRole('landlord') && !$this->hasActiveSubscription();
    }
}
