# 🔒 Security Guidelines for FindIt AI

This document outlines security best practices and implementation details.

## 🎯 Security Overview

FindIt AI implements multiple layers of security to protect user data:

1. **Authentication** - Supabase Auth with JWT tokens
2. **Authorization** - Row Level Security (RLS) policies
3. **Data Isolation** - User-scoped queries
4. **Input Validation** - Client and server-side checks
5. **File Security** - Upload restrictions and validation

## 🔑 API Keys Management

### Supabase Keys Explained

Supabase provides two types of keys:

#### 1. Anon (Public) Key ✅ SAFE FOR FRONTEND

```bash
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it can do:**
- ✅ Read public data
- ✅ Sign up users
- ✅ Sign in users
- ✅ Access user's own data (via RLS)

**What it CANNOT do:**
- ❌ Bypass Row Level Security
- ❌ Access other users' data
- ❌ Perform admin operations
- ❌ Delete database tables

**Where to use:** 
- Frontend code
- Environment variables
- Public repositories (if needed)

#### 2. Service Role Key ⚠️ NEVER IN FRONTEND

```bash
# ❌ NEVER USE THIS IN FRONTEND
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it can do:**
- ⚠️ Bypass ALL security policies
- ⚠️ Access ANY user's data
- ⚠️ Perform admin operations
- ⚠️ Delete/modify anything

**Where to use:**
- Backend servers only
- Admin scripts
- Database migrations
- CI/CD pipelines

**NOT USED in this project** - We don't have a backend server.

### Environment Variables Security

#### ✅ Correct Implementation

```bash
# .env (gitignored)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```bash
# .env.example (committed to Git)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

```bash
# .gitignore
.env
.env.local
.env.production
```

#### ❌ Common Mistakes

```bash
# ❌ Don't commit .env file
git add .env  # NEVER DO THIS!

# ❌ Don't hardcode keys
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ❌ Don't use service role key in frontend
VITE_SUPABASE_SERVICE_ROLE_KEY=xxx  # DANGER!
```

## 🛡️ Row Level Security (RLS)

### Why RLS is Critical

Without RLS, the anon key could access ALL data:

```sql
-- ❌ Without RLS: Any user can see ALL items
SELECT * FROM items;  -- Returns everyone's items!

-- ✅ With RLS: Users only see their own items
SELECT * FROM items;  -- Returns only your items
```

### Our RLS Policies

#### Items Table Policies

```sql
-- 1. SELECT: Users can only view their own items
CREATE POLICY "Users can view their own items"
ON items FOR SELECT
USING (auth.uid() = user_id);

-- 2. INSERT: Users can only insert items with their user_id
CREATE POLICY "Users can insert their own items"
ON items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE: Users can only update their own items
CREATE POLICY "Users can update their own items"
ON items FOR UPDATE
USING (auth.uid() = user_id);

-- 4. DELETE: Users can only delete their own items
CREATE POLICY "Users can delete their own items"
ON items FOR DELETE
USING (auth.uid() = user_id);
```

### How RLS Works

```javascript
// User A (id: abc-123) is logged in
const { data } = await supabase
  .from('items')
  .select('*')

// PostgreSQL automatically adds:
// WHERE user_id = 'abc-123'

// User A can NEVER see User B's items!
```

### Testing RLS

```bash
# Test 1: Try to access another user's item
# Should return empty array or error
curl -X GET 'https://xxx.supabase.co/rest/v1/items?id=eq.other-user-item-id' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer USER_A_JWT"

# Test 2: Try to insert with wrong user_id
# Should fail
curl -X POST 'https://xxx.supabase.co/rest/v1/items' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer USER_A_JWT" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "OTHER_USER_ID", "item_name": "Test"}'
```

## 🗄️ Storage Security

### Storage Policies

```sql
-- 1. Upload: Users can only upload to their own folder
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. View: Anyone can view public images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');

-- 3. Delete: Users can only delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'item-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Folder Structure

```
item-images/
├── user-abc-123/
│   ├── 1703345678123.jpg
│   └── 1703345680456.png
├── user-def-456/
│   ├── 1703345690789.jpg
│   └── 1703345695123.png
└── user-ghi-789/
    └── 1703345700456.jpg
```

Each user's images are in their own folder (`user_id/timestamp.ext`)

## 🔍 Input Validation

### Client-Side Validation

```javascript
// File validation in storage.js
if (!file.type.startsWith('image/')) {
  throw new Error('Invalid file type')
}

if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large (max 5MB)')
}

const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const fileExt = file.name.split('.').pop()?.toLowerCase()
if (!validExtensions.includes(fileExt)) {
  throw new Error('Invalid file extension')
}
```

### Why Client + Server Validation?

**Client-side:**
- ✅ Better UX (instant feedback)
- ✅ Reduces server load
- ✅ Catches obvious errors early

**Server-side (Supabase):**
- ✅ Cannot be bypassed
- ✅ Ultimate security layer
- ✅ Enforced by policies

## 🚨 Common Security Vulnerabilities & Fixes

### 1. Exposed Service Role Key

**❌ Vulnerable:**
```javascript
// Never do this!
const supabase = createClient(url, SERVICE_ROLE_KEY)
```

**✅ Fixed:**
```javascript
// Use anon key only
const supabase = createClient(url, ANON_KEY)
```

### 2. Missing RLS Policies

**❌ Vulnerable:**
```sql
CREATE TABLE items (...);
-- Forgot to enable RLS!
```

**✅ Fixed:**
```sql
CREATE TABLE items (...);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...
```

### 3. Trusting Client Input

**❌ Vulnerable:**
```javascript
// Accepting user_id from client
const userId = req.body.user_id  // User could fake this!
```

**✅ Fixed:**
```javascript
// Always get user from auth
const { data: { user } } = await supabase.auth.getUser()
const userId = user.id  // Verified by JWT
```

### 4. SQL Injection

**❌ Vulnerable:**
```javascript
// Never concatenate SQL
const query = `SELECT * FROM items WHERE name = '${userInput}'`
```

**✅ Fixed:**
```javascript
// Use Supabase client (parameterized queries)
const { data } = await supabase
  .from('items')
  .select('*')
  .eq('name', userInput)  // Automatically escaped
```

### 5. XSS (Cross-Site Scripting)

**❌ Vulnerable:**
```javascript
// Directly inserting HTML
element.innerHTML = userInput
```

**✅ Fixed:**
```javascript
// React automatically escapes
<div>{userInput}</div>

// Or use textContent
element.textContent = userInput
```

## 🔐 Authentication Security

### JWT Token Management

```javascript
// Tokens are managed by Supabase SDK
// Automatically included in all requests
// Stored in httpOnly cookies (secure)

// Check token validity
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  // Redirect to login
}
```

### Session Expiry

```javascript
// Tokens automatically refresh
// Default: 1 hour expiry, 7 day refresh

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed')
  }
  if (event === 'SIGNED_OUT') {
    // Redirect to login
  }
})
```

### Password Requirements

```javascript
// Enforced in AuthContext.jsx
if (password.length < 6) {
  throw new Error('Password must be at least 6 characters')
}

// Supabase default: 6 characters minimum
// Consider increasing to 8+ for production
```

## 📋 Security Checklist

Before deploying to production:

### Database
- [ ] RLS enabled on all tables
- [ ] All CRUD policies created
- [ ] Policies tested with different users
- [ ] Indexes added for performance
- [ ] No direct SQL in client code

### Storage
- [ ] Bucket is public (for images)
- [ ] Upload policies restrict by user
- [ ] Delete policies restrict by user
- [ ] File size limits enforced
- [ ] File type validation implemented

### Authentication
- [ ] Only anon key in frontend
- [ ] Service role key never exposed
- [ ] Password requirements enforced
- [ ] Email verification enabled (optional)
- [ ] Session timeout configured

### Environment
- [ ] `.env` in `.gitignore`
- [ ] Environment variables in Vercel
- [ ] No secrets in code
- [ ] No hardcoded credentials

### Code
- [ ] Input validation everywhere
- [ ] Error messages don't leak info
- [ ] No console.logs with sensitive data
- [ ] HTTPS enforced (Vercel does this)
- [ ] CORS configured in Supabase

### Monitoring
- [ ] Supabase logs enabled
- [ ] Error tracking setup (optional)
- [ ] Regular security audits
- [ ] Dependency updates scheduled

## 🆘 Security Incident Response

If you suspect a security breach:

1. **Immediate Actions**
   - Rotate all API keys in Supabase
   - Update environment variables in Vercel
   - Force logout all users (reset JWT secret)

2. **Investigation**
   - Check Supabase logs
   - Review recent database changes
   - Audit storage bucket access

3. **Prevention**
   - Patch vulnerabilities
   - Update dependencies
   - Review and tighten policies

## 📚 Additional Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)

---

**Remember:** Security is not a one-time setup. Regularly review and update your security measures! 🔒
