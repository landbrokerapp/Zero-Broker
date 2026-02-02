# Production Authentication Setup

Authentication has been upgraded to use **Supabase Auth** instead of LocalStorage. This ensures secure, persistent sessions that work in production.

## How it Works
1. **Supabase Sessions**: The app now automatically syncs with Supabase's auth state. Refreshing the page will strictly check the valid token from Supabase.
2. **Backward Compatibility**: The existing `Shanmu` / `123456` login still works for development/testing (stored in localStorage).
3. **Admin Role**: Any user logging in with the email `admin@zerobroker.com` is automatically granted Admin privileges.

## Action Required: Create Admin User

To use the new system, you must create the admin user in your Supabase dashboard:

1. Go to your **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add User**.
3. Enter Email: `admin@zerobroker.com`
4. Enter Password: (Choose a strong secure password)
5. Click **Create User**.
   - *Note: You may need to confirm the email or disable "Confirm Email" in Auth Settings if you want to log in immediately without verifying.*

## Using the Admin Panel
- **Dev Mode**: Login with `Shanmu` / `123456`.
- **Prod Mode**: Login with `admin@zerobroker.com` / `[Your Password]`.

## Code Changes
- Modified `src/contexts/AuthContext.tsx` to integrate `supabase.auth.signInWithPassword`, `supabase.auth.signOut`, and `supabase.auth.onAuthStateChange`.
- Role assignment is currently simple: `email === 'admin@zerobroker.com'` -> Admin. For more complex roles, we can add a `profiles` table in Supabase later.
