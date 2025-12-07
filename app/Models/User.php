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
        'first_name',
        'last_name',
        'phone',
        'profile_completed_at',
        'property_setup_completed_at',
        'has_google_linked',
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
            'profile_completed_at' => 'datetime',
            'has_google_linked' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(UserSubscription::class)
            ->where(function ($query) {
                $query->where(function ($subQuery) {
                    $subQuery->where('status', 'active')
                             ->where('current_period_ends_at', '>', now());
                })->orWhere(function ($subQuery) {
                    $subQuery->where('status', 'trial')
                             ->where('trial_ends_at', '>', now());
                });
            })
            ->latest();
    }

    public function subscription(): HasOne
    {
        return $this->activeSubscription();
    }

    public function currentSubscription(): ?UserSubscription
    {
        return $this->activeSubscription;
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function hasActiveSubscription(): bool
    {
        // Get fresh subscription data to avoid caching issues
        $subscription = $this->subscriptions()
            ->where(function ($query) {
                $query->where(function ($subQuery) {
                    $subQuery->where('status', 'active')
                             ->where('current_period_ends_at', '>', now());
                })->orWhere(function ($subQuery) {
                    $subQuery->where('status', 'trial')
                             ->where('trial_ends_at', '>', now());
                });
            })
            ->latest()
            ->first();
            
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

    public function hasCompletedProfile(): bool
    {
        return !is_null($this->profile_completed_at) && 
               !empty($this->first_name) && 
               !empty($this->last_name);
    }

    /**
     * Check if the user has completed property setup
     */
    public function hasCompletedPropertySetup(): bool
    {
        return !is_null($this->property_setup_completed_at) && 
               $this->properties()->count() > 0;
    }

    public function getFullNameAttribute(): string
    {
        return trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));
    }

    public function isGoogleUser(): bool
    {
        return !empty($this->google_id);
    }

    public function needsPasswordSetup(): bool
    {
        return $this->isGoogleUser() && empty($this->password);
    }
}
