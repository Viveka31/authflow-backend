# AuthFlow — MERN Stack Auth


## API Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/forgot-password | Public | Send reset email |
| GET  | /api/auth/verify-reset-token/:token | Public | Verify token |
| POST | /api/auth/reset-password/:token | Public | Set new password |
| GET  | /api/auth/me | JWT required | Get current user |
