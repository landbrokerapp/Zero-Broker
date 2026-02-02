# Admin Auth Persistence Fix

## Problem
Admin users were being logged out immediately upon refreshing the page.

## Root Cause
The `ProtectedRoute` component was checking for authentication status *before* the `AuthContext` had finished restoring the user session from `localStorage`. Since the initial state of `user` was `null` (before the `useEffect` ran), the guard immediately redirected to the login page.

## Solution Implemented

### 1. Added Loading State to AuthContext
Modified `src/contexts/AuthContext.tsx` to include an `isLoading` boolean.
- Initialized to `true`.
- Sets to `false` only after `localStorage` check is complete.

### 2. Updated ProtectedRoute
Modified `src/components/admin/ProtectedRoute.tsx` to handle the loading state.
- If `isLoading` is true, it now renders a loading spinner instead of redirecting.
- The redirect logic only runs once `isLoading` is false.

## Verification
- Reloading the admin dashboard should now persist the login session.
- A brief loading spinner will appear while the session is restored.
