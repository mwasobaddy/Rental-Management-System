# Testing Guide: Subscription System

This guide walks through testing the complete subscription flow from OAuth to dashboard access.

## Prerequisites
- Laravel application running (`php artisan serve`)
- Node.js frontend compiled (`npm run dev`)
- Database migrations completed
- Google OAuth configured

## Test Scenarios

### 🧪 Scenario 1: New User Trial Flow
**Expected Outcome**: New user gets 14-day trial automatically

1. **Clear browser data** (cookies, local storage)
2. **Visit application** at `http://localhost:8000`
3. **Click "Sign in with Google"**
4. **Complete OAuth flow**
5. **Verify outcomes**:
   - User has `landlord` role
   - Active trial subscription created
   - Dashboard access granted immediately
   - Trial expiration date shows 14 days from now

**Database Check**:
```sql
-- Check user role
SELECT users.email, roles.name as role 
FROM users 
JOIN model_has_roles ON users.id = model_has_roles.model_id 
JOIN roles ON model_has_roles.role_id = roles.id 
WHERE users.email = 'your-email@gmail.com';

-- Check trial subscription
SELECT * FROM user_subscriptions 
WHERE user_id = (SELECT id FROM users WHERE email = 'your-email@gmail.com');
```

### 🧪 Scenario 2: Subscription Expiry Redirect
**Expected Outcome**: Expired users redirected to subscription page

1. **Manually expire trial**:
   ```sql
   UPDATE user_subscriptions 
   SET trial_ends_at = DATE('now', '-1 day'),
       current_period_ends_at = DATE('now', '-1 day'),
       status = 'expired'
   WHERE user_id = YOUR_USER_ID;
   ```

2. **Try accessing dashboard** at `/dashboard`
3. **Verify redirect** to `/subscription` page
4. **Check subscription plans** display correctly

### 🧪 Scenario 3: Subscription Purchase Flow
**Expected Outcome**: User can select and "purchase" subscription

1. **From subscription page** (`/subscription`)
2. **Select "Professional" plan** (most popular)
3. **Choose billing cycle** (monthly/yearly)
4. **Click "Get Started"**
5. **Fill checkout form** with test data:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVV: 123
6. **Submit payment**
7. **Verify outcomes**:
   - Subscription status changes to `active`
   - Dashboard access restored
   - Plan limits updated

### 🧪 Scenario 4: Dashboard Protection
**Expected Outcome**: Only users with valid subscriptions access dashboard

**Test Cases**:
- ✅ Super-admin: Always has access
- ✅ Landlord with active subscription: Has access  
- ❌ Landlord with expired subscription: Redirected
- ✅ Property manager (non-landlord): Has access
- ❌ Unauthenticated user: Redirected to login

### 🧪 Scenario 5: Subscription Status Display
**Expected Outcome**: Users see their current subscription status

**Check these locations**:
- Dashboard header/sidebar shows plan name
- Settings page displays subscription details
- Usage limits shown with progress bars
- Expiry date and renewal information visible

## Manual Testing Commands

### Database Inspection
```bash
# Check current subscriptions
php artisan tinker
>>> App\Models\User::with(['activeSubscription.subscriptionTier'])->get();

# Check specific user subscription
>>> $user = App\Models\User::where('email', 'test@example.com')->first();
>>> $user->activeSubscription;
>>> $user->hasActiveSubscription();
>>> $user->canAccessDashboard();
```

### Create Test Subscriptions
```php
// In tinker
$user = App\Models\User::find(1);
$tier = App\Models\SubscriptionTier::where('slug', 'professional')->first();

// Create active subscription
App\Models\UserSubscription::create([
    'user_id' => $user->id,
    'subscription_tier_id' => $tier->id,
    'status' => 'active',
    'billing_cycle' => 'monthly',
    'amount_paid' => $tier->price_monthly,
    'payment_method' => 'demo_card',
    'current_period_starts_at' => now(),
    'current_period_ends_at' => now()->addMonth(),
]);
```

### Reset User for Testing
```php
// Remove all subscriptions for fresh test
App\Models\UserSubscription::where('user_id', $userId)->delete();

// Or expire current subscription
$subscription = App\Models\UserSubscription::where('user_id', $userId)->first();
$subscription->update([
    'status' => 'expired',
    'current_period_ends_at' => now()->subDay(),
]);
```

## Expected Behaviors

### ✅ Successful Flows
- **New OAuth user**: Gets trial subscription automatically
- **Trial user**: Can access dashboard for 14 days
- **Paid subscriber**: Full dashboard access
- **Super admin**: Always has access regardless of subscription
- **Property manager**: Has access without subscription requirement

### ❌ Blocked Flows  
- **Expired landlord**: Redirected to subscription page
- **Unauthenticated user**: Redirected to login
- **Cancelled subscription**: Dashboard access denied

### ⚠️ Edge Cases to Test
- **Multiple subscriptions**: Only active one should count
- **Trial extension**: Admin can extend trials
- **Subscription downgrade**: Features should adjust accordingly
- **Failed payment**: Grace period behavior
- **Account suspension**: All access blocked

## Troubleshooting Common Issues

### Issue: User not getting trial subscription
**Check**: 
- GoogleController creates subscription in `handleCallback()`
- SubscriptionTier with slug 'free-trial' exists
- User has 'landlord' role assigned

### Issue: Dashboard still accessible after expiry
**Check**:
- RequireSubscription middleware registered in `bootstrap/app.php`
- Route group includes 'subscription' middleware
- `hasActiveSubscription()` method logic

### Issue: Subscription page not loading
**Check**:
- React routes generated with `php artisan wayfinder:generate`
- Frontend compiled with `npm run dev`
- SubscriptionController routes registered

### Issue: Payment form not working
**Check**:
- Demo payment validation in SubscriptionController
- JavaScript form validation
- CSRF token included in forms

## Performance Testing

### Load Testing Scenarios
- **100 concurrent OAuth signups**: Check trial creation performance
- **Subscription page loads**: Verify plan loading speed
- **Dashboard access checks**: Test middleware performance
- **Payment processing**: Simulate checkout load

### Database Optimization Checks
- **Index on user_subscriptions.user_id**
- **Index on user_subscriptions.status**  
- **Index on subscription_tiers.is_active**
- **Query optimization** for hasActiveSubscription()

---

After running these tests, your subscription system should handle all user flows correctly, from initial signup through payment and access control.