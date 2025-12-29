# Supabase Database & Storage Setup Guide

## ✅ What's Completed

### Frontend Integration
- ✅ Created Supabase helper functions for items CRUD operations
- ✅ Created storage helper for image uploads
- ✅ Updated AddItemPage to use Supabase
- ✅ Updated FindItemPage to use Supabase  
- ✅ Updated StoredItemsPage to use Supabase
- ✅ Added category field support

### Database Schema
- ✅ Created SQL schema file (`supabase-schema.sql`)
- ✅ Defined items table with RLS policies
- ✅ Added storage bucket configuration

---

## 🔧 Setup Steps (You Need To Do)

### Step 1: Setup Supabase Project

1. Go to https://app.supabase.com
2. Create a new project or select existing one
3. Wait for database to be ready

### Step 2: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql`
4. Paste and click **Run**
5. Verify tables created in **Table Editor**

### Step 3: Setup Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Bucket settings:
   - **Name**: `item-images`
   - **Public bucket**: ✅ **Yes** (enable)
   - Click **Create bucket**

### Step 4: Add Storage Policies

1. After creating bucket, go to **Policies** tab
2. Click **New Policy**
3. Add these 3 policies:

#### Policy 1: Upload Images
```sql
CREATE POLICY "Users can upload their own images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'item-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: View Images (Public)
```sql
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'item-images');
```

#### Policy 3: Delete Own Images
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'item-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 5: Update Environment Variables

Already set in `.env`, just update with your values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6: Restart Dev Server

```bash
# Stop current servers (Ctrl+C)
npm run dev
```

---

## 🧪 Testing Instructions

### 1. Sign Up / Sign In
- Create account or login

### 2. Add Item
- Go to **Add Item** page
- Fill: Name, Location, Category (optional)
- Upload image (optional)
- Submit

### 3. View Items
- Go to **Stored Items**
- Should see all your items
- Click delete to remove items

### 4. Find Item
- Go to **Find Item**
- Search by name, location, or category
- Should return matching items

---

## 📋 Database Schema Summary

### Items Table
```
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- item_name: TEXT (required)
- location: TEXT (required)
- category: TEXT (optional)
- image_url: TEXT (nullable)
- created_at: TIMESTAMP (auto)
```

### Row Level Security
- Users can only access their own items
- All operations (SELECT, INSERT, UPDATE, DELETE) are protected

### Storage Bucket
- Name: `item-images`
- Public read access
- User-specific upload/delete permissions

---

## ⚠️ Important Notes

1. **Backend NOT needed** - Direct Supabase connection from frontend
2. **Images stored in Supabase Storage** - Not local filesystem
3. **RLS protects data** - Users can only see their own items
4. **No computer vision yet** - Just keyword-based search
5. **Category field added** - Optional classification

---

## 🎯 Current Status

✅ **All frontend code updated**
✅ **Database schema created**
✅ **Storage helpers implemented**
⏳ **Waiting for you to:**
   1. Run SQL schema in Supabase
   2. Create storage bucket
   3. Add storage policies
   4. Update .env with credentials
   5. Test the application

---

Ready to test once you complete the setup steps!
