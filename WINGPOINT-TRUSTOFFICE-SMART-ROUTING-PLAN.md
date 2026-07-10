# WingPoint → TrustOffice Smart Routing System
## Implementation Plan for "Existing Account" Recognition

**Date:** July 10, 2026  
**Status:** Proposed — ready for implementation  
**Files affected:** TrustOffice backend (1 router), TrustOffice frontend (3 pages + 1 new page), WingPoint integration (call site)

---

## 1. Problem Summary

The provision API (`POST /external/provision-trustoffice`) correctly handles idempotent provisioning and existing-user trust addition, but the **API response** and **frontend routing** don't differentiate between four distinct user states. This leads to:

- Paid users hitting the `/pricing` page guard ("You're already subscribed") — dead end
- Free users not being told they need to subscribe
- Trustee-plan users adding a 2nd trust with no upgrade prompt
- No "recommended action" in the API response for WingPoint to act on

### The Four User States After Provisioning

| State | Trust Added? | What User Needs | Current Behavior |
|-------|-------------|-----------------|-----------------|
| **New user** | ✅ | Set password → subscribe | ✅ Works (set-password email → /pricing) |
| **Existing free user** | ✅ | Log in → subscribe | ⚠️ Gets set-password email (confusing if they already have a password) |
| **Existing paid (Trustee, 1 trust)** | ✅ | Log in → upgrade to Estate | ❌ Hits /pricing guard, dead end |
| **Existing paid (Estate/Advisor)** | ✅ | Just log in — trust is there | ❌ Hits /pricing guard, dead end |

### WingPoint Package → Required Plan Mapping

| WingPoint Package | Trust Credits | Total Trusts After | Min TO Plan Required |
|-------------------|--------------|--------------------|--------------------|
| Single Trust ($3K) | 1 | 1 | Trustee ($79/mo) |
| Estate Bundle ($5.5K) | 2 | 2 | Estate ($149/mo) |
| Builder Bundle ($9.5K) | 4 | 4 | Estate ($149/mo, 5 trust limit) |

---

## 2. Architecture: `recommended_action` in API Response

### Design Principle

The provision API should return a **`recommended_action`** object that tells WingPoint exactly what to do next. WingPoint uses this to either:
- Redirect the user's browser to a TrustOffice URL, OR
- Display the right message in WingPoint's UI with a link

### The `recommended_action` Object

```json
{
  "recommended_action": {
    "action": "set_password_and_subscribe",
    "redirect_url": "https://app.trustoffice.app/reset-password?token=xxx&coupon=WINGPOINT50",
    "fallback_url": "https://app.trustoffice.app/login",
    "message": "Check your email to set your password and activate your trust.",
    "requires_payment": true,
    "suggested_plan": "trustee",
    "suggested_billing_period": "monthly"
  }
}
```

### Action Types

| `action` | When | `redirect_url` points to | `requires_payment` |
|----------|------|--------------------------|-------------------|
| `set_password_and_subscribe` | New user, no account yet | `/reset-password?token=xxx&coupon=WINGPOINT50` | true |
| `login_and_subscribe` | Existing user, free plan | `/login?wp=1&coupon=WINGPOINT50` | true |
| `login_and_upgrade` | Existing paid user, plan too small for trust count | `/login?wp=1&action=upgrade` | true |
| `login_only` | Existing paid user, plan covers trust count | `/login?wp=1` | false |
| `set_password_only` | Existing user, no password set yet (provisioned but never activated), free plan | `/reset-password?token=xxx&coupon=WINGPOINT50` | true |
| `set_password_and_login` | Existing user, no password set, paid plan covers trusts | `/reset-password?token=xxx` | false |

### Plan Sufficiency Logic

The backend determines `suggested_plan` and whether an upgrade is needed by comparing:
1. **Current trust count** (after adding this trust) vs. **current plan's trust limit**
2. **WingPoint package** (`source_package` in the request) → total expected trusts

```python
def determine_plan_sufficiency(current_plan, trust_count_after, legacy_trust_limit=None):
    """
    Returns (is_sufficient, suggested_plan, needs_upgrade).
    """
    limit = get_trust_limit(current_plan, legacy_trust_limit)
    
    if trust_count_after <= limit:
        return (True, current_plan, False)
    
    # Need more capacity — suggest minimum plan that fits
    if trust_count_after <= 5:
        return (False, "estate", True)
    elif trust_count_after > 5:
        return (False, "advisor", True)
    else:
        return (False, "estate", True)  # default fallback
```

---

## 3. Backend Changes

### File: `backend/routers/external.py`

#### Change 1: Add `recommended_action` computation function

Insert a new helper function after the trust type mapping section (~line 105):

```python
# ==================== RECOMMENDED ACTION LOGIC ====================

# Package → minimum plan mapping
PACKAGE_MIN_PLAN = {
    "single_trust": "trustee",    # 1 trust → Trustee ($79)
    "estate_bundle": "estate",    # 2 trusts → Estate ($149)
    "builder_bundle": "estate",   # 4 trusts → Estate ($149, 5 trust limit)
}

# Plan hierarchy for comparison
PLAN_RANK = {"free": 0, "none": 0, "trial": 0, "forever_free": 0,
             "trustee": 1, "estate": 2, "advisor": 3,
             "monthly": 1, "annual": 1}  # legacy = trustee equivalent


def compute_recommended_action(
    is_new_user: bool,
    existing_sub: dict | None,
    trust_count_after: int,
    source_package: str | None,
    set_password_url: str,
    frontend_url: str,
    coupon_code: str | None,
    has_password: bool,
) -> dict:
    """
    Determine the recommended next action for a provisioned user.
    
    Returns an action object with redirect_url, message, and plan info
    that WingPoint uses to route the user to the right TrustOffice page.
    """
    coupon_param = f"&coupon={coupon_code}" if coupon_code else ""
    
    # ---- NEW USER ----
    if is_new_user:
        suggested_plan = PACKAGE_MIN_PLAN.get(source_package, "trustee")
        return {
            "action": "set_password_and_subscribe",
            "redirect_url": set_password_url,
            "fallback_url": f"{frontend_url}/login",
            "message": "Check your email to set your password, then choose your TrustOffice plan.",
            "requires_payment": True,
            "suggested_plan": suggested_plan,
            "suggested_billing_period": "monthly",
        }
    
    # ---- EXISTING USER ----
    plan_type = (existing_sub or {}).get("plan_type", "free")
    sub_status = (existing_sub or {}).get("status", "active")
    legacy_limit = (existing_sub or {}).get("legacy_trust_limit")
    
    is_paid = plan_type not in ("free", "none", "trial", "forever_free") and sub_status == "active"
    plan_limit = get_trust_limit(plan_type, legacy_limit)
    is_sufficient = trust_count_after <= plan_limit
    
    # Determine suggested plan from package or trust count
    package_plan = PACKAGE_MIN_PLAN.get(source_package) if source_package else None
    if trust_count_after > 5:
        count_plan = "advisor"
    elif trust_count_after > 1:
        count_plan = "estate"
    else:
        count_plan = "trustee"
    suggested_plan = package_plan or count_plan
    needs_upgrade = PLAN_RANK.get(plan_type, 0) < PLAN_RANK.get(suggested_plan, 1)
    
    if not is_paid:
        # Free/no subscription — needs to subscribe
        if has_password:
            return {
                "action": "login_and_subscribe",
                "redirect_url": f"{frontend_url}/login?wp=1{coupon_param}",
                "fallback_url": f"{frontend_url}/login",
                "message": "Your trust has been added. Log in to choose your plan and activate it.",
                "requires_payment": True,
                "suggested_plan": suggested_plan,
                "suggested_billing_period": "monthly",
            }
        else:
            # Existing user never set password
            return {
                "action": "set_password_and_subscribe",
                "redirect_url": set_password_url,
                "fallback_url": f"{frontend_url}/login",
                "message": "Check your email to set your password, then choose your TrustOffice plan.",
                "requires_payment": True,
                "suggested_plan": suggested_plan,
                "suggested_billing_period": "monthly",
            }
    
    # ---- EXISTING PAID USER ----
    if is_sufficient:
        # Plan covers the trust count — just log in
        if has_password:
            return {
                "action": "login_only",
                "redirect_url": f"{frontend_url}/login?wp=1",
                "fallback_url": f"{frontend_url}/login",
                "message": f"Your trust has been added to your {plan_type} plan. Log in to access it.",
                "requires_payment": False,
                "suggested_plan": plan_type,
                "suggested_billing_period": (existing_sub or {}).get("billing_period", "monthly"),
            }
        else:
            return {
                "action": "set_password_and_login",
                "redirect_url": set_password_url,  # no coupon needed
                "fallback_url": f"{frontend_url}/login",
                "message": f"Your trust has been added. Set your password to log in and access it.",
                "requires_payment": False,
                "suggested_plan": plan_type,
                "suggested_billing_period": (existing_sub or {}).get("billing_period", "monthly"),
            }
    else:
        # Paid but needs more capacity — needs upgrade
        if has_password:
            return {
                "action": "login_and_upgrade",
                "redirect_url": f"{frontend_url}/login?wp=1&action=upgrade&plan={suggested_plan}{coupon_param}",
                "fallback_url": f"{frontend_url}/login",
                "message": f"Your trust has been added. Log in to upgrade from {plan_type} to {suggested_plan} — your current plan supports {int(plan_limit) if plan_limit != float('inf') else 'unlimited'} trusts.",
                "requires_payment": True,
                "suggested_plan": suggested_plan,
                "suggested_billing_period": (existing_sub or {}).get("billing_period", "monthly"),
                "current_plan": plan_type,
                "current_trust_limit": int(plan_limit) if plan_limit != float('inf') else -1,
                "trust_count_after": trust_count_after,
            }
        else:
            return {
                "action": "set_password_and_upgrade",
                "redirect_url": set_password_url,
                "fallback_url": f"{frontend_url}/login",
                "message": f"Your trust has been added. Set your password, then upgrade to {suggested_plan} to manage all your trusts.",
                "requires_payment": True,
                "suggested_plan": suggested_plan,
                "suggested_billing_period": "monthly",
                "current_plan": plan_type,
                "current_trust_limit": int(plan_limit) if plan_limit != float('inf') else -1,
                "trust_count_after": trust_count_after,
            }
```

#### Change 2: Fetch subscription + trust count + password state before building response

In the provision endpoint, after trust creation and before the response section (~line 587), add:

```python
    # ---- GATHER STATE FOR RECOMMENDED ACTION ----
    existing_sub = await db.subscriptions.find_one({"user_id": user_id}, {"_id": 0})
    trust_count_after = await db.trusts.count_documents({"user_id": user_id})
    
    # Check if user has set a password (existing users may not have)
    user_doc = await db.users.find_one({"user_id": user_id}, {"password_hash": 1, "_id": 0})
    has_password = bool(user_doc and user_doc.get("password_hash"))
    
    # For existing users who already have a password, don't send set-password email
    # (they can just log in). Still generate the token as a fallback.
    send_welcome = is_new_user or not has_password
```

#### Change 3: Conditionally send welcome email

Replace the email-send block (~line 542-559) with:

```python
    # ---- SEND WELCOME EMAIL (only if user needs to set password) ----
    email_status = "skipped"
    email_result = {"status": "skipped"}
    
    if send_welcome:
        user_name = display_name or email.split("@")[0]
        try:
            email_result = await email_service.send_welcome_set_password_email(
                to_email=email,
                user_name=user_name,
                set_password_url=set_password_url
            )
            email_status = email_result.get("status", "unknown")
        except Exception as e:
            email_result = {"status": "failed", "error": str(e)}
            email_status = "failed"
            logger.error(f"Provision: Welcome email raised exception for {email}: {e}")
    else:
        # Existing user with password — send a "trust added" notification instead
        try:
            email_result = await email_service.send_trust_added_notification(
                to_email=email,
                user_name=existing_user.get("name", email.split("@")[0]) if existing_user else email.split("@")[0],
                trust_name=request.trust_name,
                login_url=f"{frontend_url}/login?wp=1",
            )
            email_status = email_result.get("status", "unknown")
        except Exception as e:
            email_result = {"status": "failed", "error": str(e)}
            email_status = "failed"
            logger.error(f"Provision: Trust-added notification email failed for {email}: {e}")
```

#### Change 4: Add `recommended_action` to API response

Replace the response-building block (~line 587-607) with:

```python
    # ---- COMPUTE RECOMMENDED ACTION ----
    recommended = compute_recommended_action(
        is_new_user=is_new_user,
        existing_sub=existing_sub,
        trust_count_after=trust_count_after,
        source_package=request.source_package,
        set_password_url=set_password_url,
        frontend_url=frontend_url,
        coupon_code=request.coupon_code,
        has_password=has_password,
    )

    # ---- BUILD RESPONSE ----
    response = {
        "status": "created" if is_new_user else "trust_added",
        "user_id": user_id,
        "trust_id": trust_id,
        "set_password_url": set_password_url if send_welcome else None,
        "set_password_expires": expires_at.isoformat() if send_welcome else None,
        "is_new_user": is_new_user,
        "has_password": has_password,
        "email": email,
        "trust_name": request.trust_name,
        "email_status": email_status,
        "trust_count": trust_count_after,
        "current_plan": (existing_sub or {}).get("plan_type", "free") if not is_new_user else None,
        "recommended_action": recommended,
    }

    if email_status == "failed":
        response["message"] = f"Account {'created' if is_new_user else 'updated'}, but email failed: {email_result.get('error', 'unknown')}"
    elif email_status == "skipped" and not send_welcome:
        response["message"] = f"Trust added to existing account. Login notification sent to {email}."
    elif email_status == "skipped":
        response["message"] = "Account created, but email service is not configured."
    else:
        action_msg = recommended.get("message", "")
        response["message"] = f"Trust {'created' if is_new_user else 'added'}. {action_msg}"

    return response
```

#### Change 5: Add `send_trust_added_notification` to email_service

In `backend/email_service.py`, add a new method:

```python
async def send_trust_added_notification(self, to_email: str, user_name: str, trust_name: str, login_url: str) -> dict:
    """Send a 'trust added to your account' notification to an existing user."""
    if not self.is_configured:
        return {"status": "skipped"}
    
    subject = f"New Trust Added: {trust_name}"
    html_body = self._render_trust_added_template(user_name, trust_name, login_url)
    
    return await self._send_email(to_email, subject, html_body)
```

(With a corresponding HTML template in `email_templates.py`.)

#### Change 6: Update the `status` endpoint to also return `recommended_action`

In the `provision_status` endpoint (~line 693), add subscription + trust count data:

```python
    # Get subscription and trust count for recommended action
    sub = await db.subscriptions.find_one({"user_id": provision["user_id"]}, {"_id": 0})
    trust_count = await db.trusts.count_documents({"user_id": provision["user_id"]})
    
    # Recompute recommended action
    source_package = provision.get("source_package")
    coupon_code = provision.get("coupon_code")
    frontend_url = os.environ.get('FRONTEND_URL', 'https://app.trustoffice.app')
    
    recommended = compute_recommended_action(
        is_new_user=provision.get("is_new_user", True),
        existing_sub=sub,
        trust_count_after=trust_count,
        source_package=source_package,
        set_password_url=provision.get("set_password_url", ""),
        frontend_url=frontend_url,
        coupon_code=coupon_code,
        has_password=has_password,
    )
    
    return {
        # ... existing fields ...
        "trust_count": trust_count,
        "current_plan": sub.get("plan_type") if sub else "free",
        "recommended_action": recommended,
    }
```

---

## 4. Frontend Changes

### File: `frontend/src/pages/PricingPage.js`

#### Change 1: Replace the blunt "already subscribed" guard with smart routing

Replace the guard at line 163-169:

```javascript
    // Smart routing for WingPoint users who already have a subscription
    if (user?.subscription?.is_active) {
      const urlParams = new URLSearchParams(window.location.search);
      const isWingPoint = urlParams.get('wp') === '1' || urlParams.get('coupon') === 'WINGPOINT50';
      
      if (isWingPoint) {
        // WingPoint user with active subscription — route to billing for upgrade
        const action = urlParams.get('action');
        const suggestedPlan = urlParams.get('plan');
        
        if (action === 'upgrade' && suggestedPlan) {
          toast.info(`You're adding a trust that needs a higher plan. Redirecting to upgrade...`);
          navigate(`/settings/billing?upgrade=${suggestedPlan}&wp=1`);
          return;
        } else {
          // Already subscribed, plan is sufficient — just go to dashboard
          toast.success("Your trust is ready! Taking you to your dashboard.");
          navigate('/dashboard?wp_welcome=1');
          return;
        }
      }
      
      // Non-WingPoint: original behavior
      toast.info("You're already subscribed. Manage your plan in Settings.");
      navigate('/settings/billing');
      return;
    }
```

### File: `frontend/src/pages/ResetPasswordPage.js`

#### Change 1: Smart post-password-set routing based on URL params

Replace the success state block (line 128-155) to check for `action` and `plan` params:

```javascript
  // Success state
  if (success) {
    const actionParam = searchParams.get('action');
    const planParam = searchParams.get('plan');
    const isWingPoint = coupon || searchParams.get('wp') === '1';
    
    // Determine where to send user after password set
    let nextUrl = '/';
    let buttonText = 'Go to Login';
    let message = 'Your password has been successfully reset. You can now log in with your new password.';
    
    if (isWingPoint && actionParam === 'upgrade' && planParam) {
      // Existing paid user who needs to upgrade after setting password
      message = `Your password is set. Log in to upgrade your plan and manage all your trusts. Your $50 WingPoint discount will be applied.`;
      nextUrl = `/login?wp=1&action=upgrade&plan=${planParam}${coupon ? `&coupon=${coupon}` : ''}`;
      buttonText = 'Continue to Login';
    } else if (isWingPoint && coupon) {
      // New user or free user — needs to subscribe
      message = 'Your password is set. Now choose your TrustOffice plan to activate your trust. Your $50 WingPoint discount will be applied at checkout.';
      nextUrl = `/pricing?coupon=${coupon}`;
      buttonText = 'Choose Your Plan';
    } else if (isWingPoint) {
      // Existing paid user, plan sufficient — just log in
      message = 'Your password is set. Log in to access your trust.';
      nextUrl = '/login?wp=1';
      buttonText = 'Go to Login';
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-subtle-bg p-4">
        <div className="w-full max-w-md">
          <div className="card-trust corner-mark text-center" data-testid="success-card">
            <div className="w-16 h-16 mx-auto mb-4 bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-serif text-xl text-navy mb-2">Password Set Successfully</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button 
              onClick={() => navigate(nextUrl)}
              className="btn-primary w-full"
              data-testid="go-to-login-btn"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
```

### File: `frontend/src/pages/BillingPage.js`

#### Change 1: Auto-highlight suggested upgrade plan for WingPoint users

In the `useEffect` / `loadSubscription` area, check for URL params:

```javascript
  // Check for WingPoint upgrade intent
  const upgradePlan = searchParams.get('upgrade');
  const isWingPoint = searchParams.get('wp') === '1';
  
  useEffect(() => {
    if (upgradePlan && isWingPoint) {
      // Auto-scroll to the suggested plan and highlight it
      setTimeout(() => {
        const planCard = document.querySelector(`[data-testid="tier-card-${upgradePlan}"]`);
        if (planCard) {
          planCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add visual highlight
          planCard.classList.add('ring-2', 'ring-gold', 'ring-offset-2');
          toast.info(`Your WingPoint package requires the ${planDisplayName(upgradePlan)} plan. Upgrade below to activate all your trusts.`);
        }
      }, 500);
    }
  }, [upgradePlan, isWingPoint]);
```

#### Change 2: Show WingPoint context banner on billing page

Add near the top of the render:

```jsx
  {isWingPoint && upgradePlan && (
    <div className="bg-gradient-to-r from-navy/10 to-blue-50 dark:from-navy/30 dark:to-blue-900/30 px-6 py-4 mb-6 border-b border-navy/20 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🤝</span>
        <span className="font-medium text-navy dark:text-white">WingPoint Trust Activation</span>
      </div>
      <p className="text-sm text-muted-foreground">
        You're adding a trust that requires the <strong>{planDisplayName(upgradePlan)}</strong> plan.
        Upgrade below to manage all your trusts. {couponCode && `Your $50 WingPoint discount will be applied.`}
      </p>
    </div>
  )}
```

### New File: `frontend/src/pages/WingPointLandingPage.js`

Create a dedicated landing page that can be used as the `redirect_url` from WingPoint for existing users. This gives a branded "trust added" experience instead of dumping them on the login page:

```javascript
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, LogIn } from 'lucide-react';

export default function WingPointLandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const action = searchParams.get('action') || 'login';
  const plan = searchParams.get('plan');
  const trustName = searchParams.get('trust_name');
  const coupon = searchParams.get('coupon');
  
  const messages = {
    login: {
      title: 'Your Trust Is Ready',
      body: `Your trust${trustName ? ` "${trustName}"` : ''} has been added to your TrustOffice account. Log in to start managing it.`,
      cta: 'Log In to Your Account',
      ctaAction: () => navigate(`/login?wp=1${coupon ? `&coupon=${coupon}` : ''}`),
    },
    upgrade: {
      title: 'Upgrade to Activate Your Trust',
      body: `Your trust has been added, but your current plan doesn't support enough trusts. Upgrade to the ${plan} plan to activate it.`,
      cta: `Upgrade to ${plan}`,
      ctaAction: () => navigate(`/settings/billing?upgrade=${plan}&wp=1${coupon ? `&coupon=${coupon}` : ''}`),
    },
    subscribe: {
      title: 'Choose Your Plan',
      body: `Your trust has been added to your account. Choose a TrustOffice plan to activate it and start managing your trust.`,
      cta: 'View Plans',
      ctaAction: () => navigate(`/pricing?coupon=${coupon || 'WINGPOINT50'}`),
    },
  };
  
  const config = messages[action] || messages.login;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-subtle-bg p-4">
      <div className="w-full max-w-md">
        <div className="card-trust corner-mark text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">🤝</span>
            <span className="font-medium text-navy">WingPoint → TrustOffice</span>
          </div>
          <h2 className="font-serif text-xl text-navy mb-3">{config.title}</h2>
          <p className="text-muted-foreground mb-6">{config.body}</p>
          <Button onClick={config.ctaAction} className="btn-primary w-full mb-3">
            {config.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-navy flex items-center justify-center gap-1">
            <LogIn className="w-3 h-3" />
            Just take me to login
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### File: `frontend/src/App.js`

Add the route:

```javascript
import WingPointLandingPage from "@/pages/WingPointLandingPage";
// ...
<Route path="/wp/welcome" element={<WingPointLandingPage />} />
```

---

## 5. WingPoint Integration Changes

### What WingPoint does with the new API response

WingPoint's backend calls `POST /external/provision-trustoffice` and receives the `recommended_action` object. WingPoint should:

1. **Store `recommended_action` in its CRM** alongside the WingPoint order
2. **Use `redirect_url` for any customer-facing redirect** (post-purchase confirmation page, email follow-ups, etc.)
3. **Display `message` to the customer** in the WingPoint dashboard if they don't auto-redirect
4. **Use `suggested_plan` to set expectations** about what TrustOffice plan they'll need

### WingPoint Post-Purchase Flow (recommended)

```
WingPoint checkout complete
  → WingPoint backend calls POST /external/provision-trustoffice
  → Receives response with recommended_action
  → If action == "set_password_and_subscribe":
      → Show "Check your email" message (email is sent by TrustOffice)
      → Optionally: auto-redirect to redirect_url after 3 seconds
  → If action == "login_and_subscribe":
      → Redirect to redirect_url (/login?wp=1&coupon=WINGPOINT50)
      → User logs in, sees pricing page with coupon
  → If action == "login_and_upgrade":
      → Redirect to redirect_url (/login?wp=1&action=upgrade&plan=estate)
      → User logs in, billing page auto-highlights upgrade
  → If action == "login_only":
      → Redirect to redirect_url (/login?wp=1)
      → User logs in, sees trust in dashboard
  → If action == "set_password_and_login":
      → Show "Check your email" message
      → User sets password, lands on login
```

### Alternative: WingPoint Landing Page Redirect

Instead of multiple redirect targets, WingPoint can always redirect to:
```
https://app.trustoffice.app/wp/welcome?action={action}&plan={suggested_plan}&trust_name={trust_name}&coupon={coupon}
```

The WingPointLandingPage then handles all routing internally. This is cleaner for WingPoint (one redirect URL pattern) and gives a consistent branded experience.

---

## 6. Email Changes

### New Email: `trust_added_notification`

For existing users who already have a password, instead of the set-password email, send:

**Subject:** New Trust Added: {trust_name}

**Body:**
```
Hi {user_name},

A new trust has been added to your TrustOffice account:

Trust Name: {trust_name}
Added via: WingPoint partnership

To access your trust, log in to your account:
{login_url}

If you need to upgrade your plan to manage multiple trusts, 
you can do so from Settings → Billing after logging in.

— TrustOffice Team
```

### Modified Email: `welcome_set_password`

No content change needed — the set-password URL already includes the coupon param. The email is only sent when the user actually needs to set a password (new users or existing users without a password).

---

## 7. Implementation Order

### Phase 1: Backend (can ship independently)
1. Add `compute_recommended_action()` function to `external.py`
2. Add subscription/trust-count/has-password gathering in provision endpoint
3. Add `recommended_action` to provision response + status endpoint
4. Add `send_trust_added_notification` to email_service
5. Conditionally skip set-password email for users who already have a password

### Phase 2: Frontend (depends on Phase 1 for full effect)
6. Create `WingPointLandingPage.js`
7. Add route in `App.js`
8. Fix `PricingPage.js` guard for WingPoint users
9. Fix `ResetPasswordPage.js` success routing for upgrade/subscribe/login variants
10. Add upgrade-highlight to `BillingPage.js`

### Phase 3: WingPoint integration
11. Update WingPoint's provision call to read `recommended_action` from response
12. Use `redirect_url` for customer routing
13. (Optional) Use the `/wp/welcome` landing page as the single redirect target

---

## 8. Edge Cases & Considerations

### Edge Case: User has a canceled subscription (cancel_at_period_end)
- `sub_status` would be "active" but `cancel_at_period_end` is true
- Should treat as "needs to resubscribe" — route to `login_and_subscribe`
- Fix: check `cancel_at_period_end` in `compute_recommended_action`:
  ```python
  if sub_status == "active" and (existing_sub or {}).get("cancel_at_period_end"):
      is_paid = False  # treat as needing resubscription
  ```

### Edge Case: User was provisioned but never set password (abandoned)
- `has_password` = False → send set-password email (existing behavior, now explicit)
- `is_new_user` = False, `has_password` = False → `set_password_and_subscribe` or `set_password_and_login`

### Edge Case: Duplicate provision (same wingpoint_ref)
- Idempotent return already works — should also include `recommended_action` in the idempotent replay response
- Fix: in the `already_exists` return path (~line 284-286), recompute and include `recommended_action`

### Edge Case: Legacy monthly/annual users (grandfathered, 10 trust limit)
- `legacy_trust_limit = 10` → effectively unlimited for most WingPoint users
- `is_sufficient` will be true → `login_only` action
- This is correct behavior

### Edge Case: WingPoint sends multiple trusts for the same user (Builder Bundle = 4 trusts)
- Each trust is a separate provision call with a different `wingpoint_ref`
- After the 2nd trust, Trustee plan users will get `login_and_upgrade` → Estate
- After the 5th trust, Estate plan users will get `login_and_upgrade` → Advisor
- This works correctly because `trust_count_after` is computed live

### Edge Case: User exists but subscription is in "expired" state
- `is_paid` = False (because `sub_status != "active"`)
- Routes to `login_and_subscribe` — correct, they need to resubscribe

---

## 9. Testing Checklist

- [ ] New user, Single Trust package → `set_password_and_subscribe`, suggested_plan=trustee
- [ ] New user, Estate Bundle → `set_password_and_subscribe`, suggested_plan=estate
- [ ] New user, Builder Bundle → `set_password_and_subscribe`, suggested_plan=estate
- [ ] Existing free user, has password, Single Trust → `login_and_subscribe`, suggested_plan=trustee
- [ ] Existing free user, no password, Single Trust → `set_password_and_subscribe`
- [ ] Existing Trustee user (1 trust), adding 2nd trust → `login_and_upgrade`, suggested_plan=estate
- [ ] Existing Estate user (3 trusts), adding 4th → `login_only` (4 ≤ 5)
- [ ] Existing Estate user (5 trusts), adding 6th → `login_and_upgrade`, suggested_plan=advisor
- [ ] Existing Advisor user, adding any trust → `login_only`
- [ ] Legacy monthly user (10 trust limit), adding 2nd trust → `login_only`
- [ ] Idempotent replay returns `recommended_action`
- [ ] Status endpoint returns `recommended_action`
- [ ] PricingPage guard routes WingPoint users correctly
- [ ] ResetPasswordPage routes to upgrade when action=upgrade in URL
- [ ] BillingPage highlights suggested upgrade plan
- [ ] WingPointLandingPage renders for all action types

---

## 10. Summary of Files to Change

| File | Change |
|------|--------|
| `backend/routers/external.py` | Add `compute_recommended_action()`, gather sub/trust/password state, include `recommended_action` in response + status endpoint, conditionally send email |
| `backend/email_service.py` | Add `send_trust_added_notification()` method |
| `backend/email_templates.py` | Add trust-added notification HTML template |
| `frontend/src/pages/PricingPage.js` | Smart guard: route WingPoint users to billing/dashboard instead of blocking |
| `frontend/src/pages/ResetPasswordPage.js` | Smart post-set-password routing based on action/plan URL params |
| `frontend/src/pages/BillingPage.js` | Auto-highlight upgrade plan for WingPoint users, show WP context banner |
| `frontend/src/pages/WingPointLandingPage.js` | **NEW** — branded landing page for all WingPoint redirect scenarios |
| `frontend/src/App.js` | Add `/wp/welcome` route |

**No database schema changes needed.** All data (subscription state, trust count, password hash) already exists in MongoDB.