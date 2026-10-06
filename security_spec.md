# Security Specification: Comfort Medi+ RBAC

## 1. Data Invariants
- Admin email `comfort.designszw@gmail.com` is automatically granted the `admin` role.
- All other newly registered users are created with the `patient` role by default.
- Only an administrator can update the `role` field on a user document.
- Regular users cannot escalate their own privileges or modify other users' profiles.
- Any authenticated user can read and update their own profile document (`/users/{userId}` where `request.auth.uid == userId`), but they cannot change their `role`.
- Admins can read all user profiles and update user roles.

## 2. The Dirty Dozen Payloads (Rejection Matrix)
1. Non-admin attempting to set `role: "admin"` on registration -> PERMISSION_DENIED
2. Non-admin attempting to update another user's document -> PERMISSION_DENIED
3. User attempting to modify their own `role` from "patient" to "doctor" -> PERMISSION_DENIED
4. Unauthenticated read on `/users/{userId}` -> PERMISSION_DENIED
5. Unauthenticated write on `/users/{userId}` -> PERMISSION_DENIED
6. Injection of oversized strings (>128 chars) in ID path variables -> PERMISSION_DENIED
7. Unauthenticated write to `/admins/{adminId}` -> PERMISSION_DENIED
8. Non-admin writing to `/admins/{adminId}` -> PERMISSION_DENIED
9. Malformed role string (e.g. `role: "supergod"`) -> PERMISSION_DENIED
10. Setting unauthorized ghost fields via Shadow Update -> PERMISSION_DENIED
11. Reading another patient's private profile as a regular user -> PERMISSION_DENIED
12. Modifying `uid` property during profile update -> PERMISSION_DENIED
