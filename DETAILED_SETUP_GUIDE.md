# STEP-BY-STEP SETUP GUIDE FOR SUPABASE

## 📋 Overview
This guide will help you:
1. Get your Supabase credentials
2. Add storage policies
3. Update environment variables
4. Start your application

---

## STEP 1: Get Supabase Credentials (5 minutes)

### 1.1 Go to Supabase Dashboard
- Open your browser
- Go to: https://app.supabase.com
- Sign in with your account (or create one if you don't have it)

### 1.2 Create or Select Project
**If you DON'T have a project:**
- Click "New Project"
- Fill in:
  - **Name**: `finditai` (or any name you want)
  - **Database Password**: Create a strong password (save it somewhere!)
  - **Region**: Choose closest to you
  - Click "Create new project"
  - ⏳ Wait 2-3 minutes for setup to complete

**If you ALREADY have a project:**
- Click on your project name to open it

### 1.3 Get Your API Keys
Once in your project dashboard:

1. Click on the **⚙️ Settings** icon (bottom left)
2. Click on **API** in the sidebar
3. You'll see two important values:

**Copy these two values:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx...
```

📝 **Keep these safe - you'll need them in Step 3!**

---

## STEP 2: Setup Database Tables (3 minutes)

### 2.1 Open SQL Editor
- In your Supabase project dashboard
- Click on **🗄️ SQL Editor** (left sidebar)
- Click **+ New query** button (top right)

### 2.2 Run the Schema
1. Open the file: `supabase-schema.sql` in your project folder
2. Copy ALL the content from that file
3. Paste it into the SQL Editor
4. Click **▶️ RUN** button (bottom right)
5. You should see: ✅ "Success. No rows returned"

### 2.3 Verify Tables Created
- Click on **🗂️ Table Editor** (left sidebar)
- You should see a table called **items**
- Click on it to see the columns:
  - id
  - user_id
  - item_name
  - location
  - category
  - image_url
  - created_at

✅ **Database is ready!**

---

## STEP 3: Setup Storage Bucket (5 minutes)

### 3.1 Create Storage Bucket
- In Supabase dashboard, click **📦 Storage** (left sidebar)
- Click **New bucket** button (top right)
- Fill in:
  - **Name**: `item-images` (exactly this name!)
  - **Public bucket**: ✅ **Turn ON** (toggle it green)
  - **File size limit**: 5MB (default is fine)
  - **Allowed MIME types**: Leave as default (allows all images)
- Click **Create bucket**

✅ You should now see `item-images` bucket in the list

### 3.2 Add Storage Policies

Now we need to add 3 security policies:

#### Option A: Using SQL Editor (Recommended)

1. Go back to **SQL Editor**
2. Click **+ New query**
3. **Copy and paste ALL THREE policies below** (one at a time or all together):

```sql
-- Policy 1: Users can upload images to their own folder
CREATE POLICY "Users can upload their own images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'item-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Anyone can view images (public bucket)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'item-images');

-- Policy 3: Users can delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'item-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

4. Click **▶️ RUN**
5. Should see: ✅ "Success. No rows returned" (3 times or once if pasted all together)

#### Option B: Using Storage UI (Alternative)

1. Go to **Storage** → Click **item-images** bucket
2. Click **Policies** tab
3. Click **New policy** (repeat 3 times for each policy)

For each policy:
- **Policy name**: Copy from the policy names above
- **Policy definition**: Copy the SQL condition (the part after `WITH CHECK` or `USING`)
- **Target roles**: Leave as default
- Click **Create policy**

### 3.3 Verify Policies
- Go to **Storage** → **item-images** → **Policies** tab
- You should see 3 policies listed:
  1. Users can upload their own images
  2. Public can view images
  3. Users can delete their own images

✅ **Storage is ready!**

---

## STEP 4: Update Environment Variables (2 minutes)

### 4.1 Open .env File
In your project folder: `/Users/sakethram/Desktop/finditapp/.env`

### 4.2 Replace with Your Credentials
Replace the placeholder values with the ones you copied in Step 1:

**BEFORE:**
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**AFTER (your actual values):**
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx...
```

⚠️ **Important:**
- Don't add quotes around the values
- Don't add spaces
- Make sure there's no trailing spaces

### 4.3 Save the File
Press `Cmd + S` (Mac) or `Ctrl + S` (Windows) to save

✅ **Environment configured!**

---

## STEP 5: Restart Development Server (1 minute)

### 5.1 Stop Current Server
If your dev server is running:
- Go to the terminal where it's running
- Press `Ctrl + C` to stop it

### 5.2 Start Fresh Server

**In your terminal:**
```bash
cd /Users/sakethram/Desktop/finditapp
npm run dev
```

You should see:
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:3000/
```

### 5.3 Open in Browser
- Open your browser
- Go to: http://localhost:3000

✅ **Application is running!**

---

## STEP 6: Test Everything (5 minutes)

### 6.1 Test Authentication
1. Click **Sign Up**
2. Fill in:
   - Name: Your name
   - Email: Your email
   - Password: At least 6 characters
3. Click **Sign Up**
4. Check your email for verification (Supabase sends confirmation)
5. Click the verification link in email
6. Go back to app and **Sign In** with your email/password

### 6.2 Test Add Item
1. Click **Add Item** in navbar
2. Fill in:
   - Item Name: "Test Item"
   - Location: "On my desk"
   - Category: "Electronics" (optional)
   - Upload an image (optional)
3. Click submit
4. Should see: ✅ "Item Added Successfully!"

### 6.3 Test View Items
1. Click **Stored Items** in navbar
2. You should see your test item with:
   - Image (if uploaded)
   - Item name
   - Location
   - Date added
   - Category (if provided)

### 6.4 Test Find Item
1. Click **Find Item** in navbar
2. Type: "test" or "desk"
3. Click search
4. Should find your item with all details

### 6.5 Test Delete Item
1. Go to **Stored Items**
2. Click **Delete** on your test item
3. Confirm deletion
4. Item should disappear

---

## 🎉 SUCCESS!

If all tests pass, your application is fully functional with Supabase!

---

## 🐛 Troubleshooting

### Problem: "Missing Supabase environment variables"
**Solution:** 
- Check `.env` file has correct values
- Restart dev server after updating `.env`
- Make sure file is named exactly `.env` (not `.env.txt`)

### Problem: "Failed to add item" or "Failed to load items"
**Solution:**
- Check Supabase project is active (not paused)
- Verify tables exist in Table Editor
- Check browser console for error details (F12 → Console tab)

### Problem: "Failed to upload image"
**Solution:**
- Verify `item-images` bucket exists
- Check bucket is set to **Public**
- Verify 3 storage policies are added
- Check image file is under 5MB

### Problem: "User not authenticated" errors
**Solution:**
- Sign out and sign in again
- Clear browser cache
- Check email verification was completed

### Problem: Can't sign up or sign in
**Solution:**
- Check internet connection
- Verify Supabase credentials in `.env` are correct
- Check Supabase project is not paused

---

## 📞 Need Help?

If you're stuck on any step:
1. Check the error message in browser console (F12 → Console)
2. Check Supabase dashboard → Logs for backend errors
3. Verify each step was completed exactly as described
4. Double-check your `.env` file has the correct credentials

---

## ✅ Quick Checklist

Before testing, make sure:
- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] `item-images` bucket created (public)
- [ ] 3 storage policies added
- [ ] `.env` file updated with real credentials
- [ ] Dev server restarted
- [ ] Email verified after signup

All checked? You're good to go! 🚀
