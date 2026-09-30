# Clinic Backend — Project Overview

A code-reading pass over `ICBMT/clinic` (branch `arena/01a0f196-clinic`, base `93fd7a2`).
Everything below was read out of the repository or produced by running its own tooling in this
sandbox; where a check could not be run, that is stated explicitly.

---

## 1. What it is

A **two-sided marketplace for aesthetic/dermatology clinic treatments in Kuwait**. Customers
browse clinics, machines and treatments via a **mobile REST API**; clinic owners and platform
staff manage everything through an **Inertia/React admin dashboard**.

Market signals found in the code: default currency `KWD` (22 references in `app/`), Kuwaiti
phone prefix `+965` (19 references), the **MyFatoorah** payment gateway, and a full
English/Arabic translation pair.

Everything lives in `clinic_backend/` — the repo root holds only that directory.

## 2. Stack

| Layer | Choice |
| --- | --- |
| Framework | Laravel `^12.0` on PHP `^8.2` |
| Frontend | Inertia `^2.0` + React 19 + TypeScript 5.7 + Tailwind 4 + Vite 7 |
| UI kit | shadcn-style Radix components (`components.json`), `lucide-react`, `sonner` |
| Auth (web) | Laravel Fortify (2FA, email verification) + session guard |
| Auth (API) | Laravel Sanctum personal access tokens |
| OAuth | Socialite + custom Google/Apple token exchange |
| Permissions | `spatie/laravel-permission` |
| Audit trail | `spatie/laravel-activitylog` |
| Payments | `myfatoorah/laravel-package` + `myfatoorah/library` |
| Push | `kreait/firebase-php` + `firebase/php-jwt` |
| Debug | Laravel Telescope |
| Route typing | `laravel/wayfinder` (generates TS route helpers) |

## 3. Scale

```
PHP  (app, database, routes, config, tests)   68,452 lines
TS/TSX (resources/js)                         95,167 lines
```

| Area | Files | Lines |
| --- | --- | --- |
| `app/Models` | 46 | 5,702 |
| `app/Repositories` | 37 | 6,425 |
| `app/Contracts` | 37 | 1,184 |
| `app/Http/Controllers` | 63 | 20,158 |
| `app/Http/Requests` | 99 | 7,049 |
| `app/Http/Resources` | 44 | 4,236 |
| `app/Services` | 9 | 3,876 |
| `app/Traits` | 7 | 1,882 |
| `app/Http/Middleware` | 8 | 703 |
| `app/Providers` | 5 | 1,561 |
| `app/Console/Commands` | 7 | 988 |
| Migrations | 70 | — |
| `.tsx` pages/components | 304 (143 under `pages/dashboard`) | — |

## 4. Architecture

### 4.1 Layering

Strict **Controller → Repository-interface → Eloquent model** layering:

- `app/Contracts/*Interface.php` — 37 interfaces
- `app/Repositories/*.php` — 37 concrete implementations, all extending `BaseRepository`
- `app/Providers/AppServiceProvider.php` — binds them one by one as singletons

Controllers receive interfaces by constructor injection and never touch models for reads.
The base `app/Http/Controllers/Controller.php` supplies shared helpers: `withTransaction()`,
`logActivity()`, `parseUserAgent()`, `formatPaginationResponse()`, `getPeriodStatistics()`,
and `isRoleAllowedForApiLogin()` (which restricts API login to the `user` role only).

### 4.2 Two front doors

**Mobile API** — `routes/api.php` → `routes/api/v1.php`, **80 routes**. Protected group uses
`auth:sanctum` + `UserAccess` middleware (rejects non-`active` users and unverified phones).
Surface: auth/OTP, social login, home & discovery, categories, treatments, clinics, machines,
reviews, notifications, bookings, payments, wallet, support. Documented by a checked-in
Postman collection (`docs/postman/`, **79 requests** across 14 folders).

**Admin dashboard** — `routes/dashboard.php`, **158 routes**, all behind
`['auth', 'verified', 'check-admin-panel-access']` with a `dashboard.` name prefix.
Plus `routes/web.php` (14 public/marketing + payment callback routes) and
`routes/auth.php` (15 Fortify routes).

### 4.3 Roles & permissions

Five system roles seeded in `database/seeders/PermissionSeeder.php`:
`super-admin`, `clinic`, `clinic_manager`, `user`, `guest`
(**221 unique permission strings** across 8 groups: Platform, User Management, Clinic
Management, Location Management, Promotion Management, Finance Management, Notifications
Management, Site Settings).

Multi-tenancy is enforced in `app/Traits/ScopesClinicData.php`: super-admin sees everything,
`clinic` sees owned clinics, `clinic_manager` sees clinics assigned via `clinic_users`,
everyone else gets `whereRaw('1 = 0')`. `CheckAdminPanelAccess` logs out `user`/`guest`
accounts that reach the panel.

The seeder also creates `admin@example.com` / `password` as super admin.

### 4.4 Domain model

Core chain: **Clinic** → **Machine** → **Treatment** (with slots, weekly schedules, add-ons)
→ **Booking** → **BookingSession** → **ClinicEarning** → **ClinicPayout**.

`Booking` (523 lines) is the heart. Notable behaviour in `app/Models/Booking.php`:

- Model events fire notifications on create and on status change via `NotificationService`.
- `generateClinicEarning()` computes `gross − commission − platform fee`, **rounding each
  component to a whole number** before persisting.
- Commission comes from the clinic owner's `users.admin_commission`, falling back to the
  `vendor_default_commission` site setting (default 10%).
- Platform fee is either a fixed amount or a percentage, per
  `vendor_platform_fee_type`.
- Many legacy aliases remain (`service()` → `treatment()`, `vendor()` → `User` on
  `vendor_id`, `serviceSlot()` → `treatmentSlot()`).

Also: `Wallet` + `WalletTransaction` (top-up, refunds), `Refund`, `Transaction`,
`PaymentTransaction`, `Media` (polymorphic, incl. medical records), `Notification` +
`Broadcast`, `Otp`, `PasswordResetToken`, `ClinicSubscription` + `SubscriptionPackage`,
`CommissionSetting`, `EarningHistory`.

### 4.5 Cross-cutting services

- **`NotificationService`** (~1,200 lines, 30 methods) — creates DB notifications and queues
  Firebase pushes; has purpose-built methods like `notifyBookingCreated`,
  `notifyEarningApproved`.
- **`SiteSettingsService`** — DB-backed runtime config (OTP provider, SMSBox/Twilio,
  MyFatoorah, Firebase, Google, Apple, Maps key).
- **`OtpService`** — phone OTP with a test mode, WhatsApp template + SMS delivery.
- **`DeviceInfoService`** — user-agent parsing, attached to every activity log via an
  `Activity::creating` hook in `AppServiceProvider::boot()`.
- **`MediaService`**, **`FirebaseTopicService`**, **`GoogleLoginService`**,
  **`AppleLoginService`**.

### 4.6 i18n

`lang/en/common.php` and `lang/ar/common.php` are **4,030 lines each** (plus `auth`,
`passwords`, `myfatoorah`). The API returns `__('common.*')` strings; the dashboard ships the
whole map to the browser through Inertia shared props and consumes it via
`useTranslation()` / `translate()`. RTL is initialised before React mounts in
`resources/js/app.tsx`.

### 4.7 Scheduled work

`routes/console.php` (cron entry documented in `CRONJOB_SETUP.md`): password-reset-token
cleanup, cache/config/view/route clears, `queue:restart`, `session:gc`, model pruning,
activity-log cleanup (twice yearly), `optimize:clear`, `broadcasts:process-scheduled` every
5 min, and `queue:process` every minute. All referenced commands exist in
`app/Console/Commands/` — signatures verified. Note `db:backup` is **commented out**.

---

## 5. What I verified by running the project's own tooling

| Check | Result |
| --- | --- |
| `npm install` | ✅ exit 0 — 1,828 packages (98 audit vulnerabilities: 4 critical, 16 high) |
| `npm run build` (`vite build`) | ❌ fails: `php artisan wayfinder:generate --with-form` → `php: not found` |
| `npm run types` (`tsc --noEmit`) | ❌ **652 errors** — 172 are missing generated `@/routes`/`@/actions` modules; **480 are real**, across **82 files** |
| `npm run lint` (`eslint .`) | ❌ **695 problems** (677 errors, 18 warnings) |
| `npm run format:check` (prettier) | ❌ style issues in **275 files** |
| `php artisan test` (PHPUnit, 16 test files) | ⛔ **could not run** — see §7 |

ESLint breakdown: 381 `no-explicit-any`, 269 `no-unused-vars`, 18
`react-hooks/exhaustive-deps`, 13 `no-case-declarations`, 7
`no-constant-binary-expression`, **3 `react-hooks/rules-of-hooks`**, 2 `ban-ts-comment`,
1 `no-constant-condition`, 1 `no-empty-object-type`.

Worst files by real type errors: `components/clinic-registration-form.tsx` (106),
`pages/dashboard/treatments/edit.tsx` (32), `pages/dashboard/clinics/show.tsx` (21),
`pages/dashboard/treatment-slots/index.tsx` (15).

## 6. Structural issues found by static reading

These are code-reading findings, **not** confirmed at runtime (no PHP available — §7).

**Dead references to models that do not exist.** Five class names are referenced but have no
file in `app/Models/`:

| Missing model | Referenced from |
| --- | --- |
| `App\Models\Service` | `app/Console/Commands/AddDiscountsToServices.php`, `database/factories/BookingFactory.php`, `ReportFactory.php`, `ServiceFactory.php` |
| `App\Models\Feedback` | `database/factories/FeedbackFactory.php` |
| `App\Models\Coupon` | `database/factories/LoyaltyPointFactory.php` |
| `App\Models\ReportReason` | `app/Repositories/ReportReasonRepository.php:6` |
| `App\Models\MaintenanceMode` | `app/Http/Middleware/EnforceMaintenanceMode.php:5` |

`BookingFactory` is the concerning one: it sets `'service_id' => \App\Models\Service::factory()`,
so any test or seeder using it would fatal. (`DatabaseSeeder` does not currently call
`BookingFactory`.)

**`User.php` relations pointing at nothing.** `coupons()`, `vendorSubscriptions()`,
`servicePackages()`, `loyaltyPoints()`, `loyaltyTracker()`, `couponUsages()` reference
`Coupon`, `VendorSubscription`, `ServicePackage`, `LoyaltyPoint`, `LoyaltyTracker`,
`CouponUsage` — none of which exist anywhere in `app/`. Calling any of them raises a
class-not-found error.

**Duplicate API route.** `routes/api/v1.php` registers `GET clinics/{id}/reviews` twice —
line 123 to `ReviewController::getClinicReviews` and line 124 to `ClinicController::reviews`.
Laravel keeps the first match, so `ClinicController::reviews` is unreachable.

**Unbound repositories.** Four contracts are never bound in `AppServiceProvider`:
`BaseRepositoryInterface` (by design), `CommissionSettingRepositoryInterface`,
`ReportReasonRepositoryInterface`, `VendorReportRepositoryInterface`. I checked all three
non-base ones: none is injected anywhere, so they are dead code rather than live
resolution failures.

**`EnforceMaintenanceMode` is dead and would crash if wired up.** It is not registered in
`bootstrap/app.php` nor applied to any route. If it were, `MaintenanceMode::query()` throws an
`Error` (class not found), and the surrounding `catch (\Exception $e)` does **not** catch
`Error` — it would be a fatal. It also reads `$mode->body_en` / `$mode->body_ar`, but the
migration creates `description_en` / `description_ar`.

**`config/services.php` touches the database at boot.** The `firebase.credentials` entry runs
a closure calling `Schema::hasTable('site_settings')` during config resolution. It is guarded
with `try`/`catch` and `app()->bound('db')`, but it makes config loading order-sensitive.

**Refactor debris generally.** The codebase is mid-migration from a *vendor/service* domain to
a *clinic/treatment* one. `vendor_*` columns, `vendor()`/`service()` aliases, `vendorProfile()`,
`scopeVendors*`, and dashboard folders `vendors/`, `services/`, `services-feedbacks/`,
`services-reports/` all coexist with the new naming.

## 7. What I could not verify, and why

**No PHP runtime in this sandbox.** There is no `php` or `composer` binary anywhere on the
filesystem (searched `/` to depth 4), `vendor/` is absent, and the package mirrors are
network-blocked:

```
deb.debian.org      → connection failed (IP 151.101.194.132:80)   # apt-get update
repo.packagist.org  → HTTP 000                                    # composer install
registry.npmjs.org  → HTTP 200                                    # npm install  ✅
```

Consequences:

- **The PHPUnit suite (16 files, including 3 API feature tests totalling 1,299 lines) was
  never executed.** No claim in this document about runtime behaviour is backed by a passing
  test.
- `php artisan` cannot run, so `route:list`, migrations, and the seeder are unverified at
  runtime.
- Because `wayfinder:generate` needs `artisan`, `npm run build` cannot complete, which is why
  172 of the 652 `tsc` errors are missing generated modules rather than source defects.
  **The true type-error count is somewhere between 480 and 652**, and cannot be pinned down
  without PHP.
- The §6 findings are from reading and grepping, not from executing the code paths.

To close that gap the project needs a PHP 8.2+ environment with Composer access; then
`composer install && php artisan test`.

## 8. Orientation map

| I want to change… | Start here |
| --- | --- |
| A mobile API endpoint | `routes/api/v1.php` → `app/Http/Controllers/Api/V1/` |
| A dashboard screen | `routes/dashboard.php` → `app/Http/Controllers/Dashboard/` → `resources/js/pages/dashboard/` |
| Booking rules / pricing | `app/Models/Booking.php`, `app/Repositories/BookingRepository.php`, `app/Http/Controllers/Api/V1/BookingController.php` (1,210 lines) |
| Money flow | `ClinicEarning`, `ClinicPayout`, `Wallet`, `PaymentTransaction`, `MyFatoorahService` |
| Permissions | `database/seeders/PermissionSeeder.php`, `app/Traits/ScopesClinicData.php`, `resources/js/hooks/use-permissions.tsx` |
| Any user-facing string | `lang/en/common.php` + `lang/ar/common.php` (keep in sync; `generate:translationstrings` helps) |
| Notifications | `app/Services/NotificationService.php`, `app/Jobs/SendPushNotification.php` |
| Runtime config | `site_settings` table via `SiteSettingsService` / `SiteSetting::getValue()` |
