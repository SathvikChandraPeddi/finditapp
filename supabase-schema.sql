-- =====================================================
-- FindIt AI - Supabase Database Schema
-- =====================================================

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS items_user_id_idx ON items(user_id);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS items_item_name_idx ON items(item_name);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own items
CREATE POLICY "Users can view their own items"
    ON items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own items
CREATE POLICY "Users can insert their own items"
    ON items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own items
CREATE POLICY "Users can update their own items"
    ON items
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own items
CREATE POLICY "Users can delete their own items"
    ON items
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Storage Bucket Setup (Run in Supabase Storage UI or via API)
-- =====================================================

-- Bucket: item-images
-- Settings:
--   - Public: true (allows public read access)
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- Storage RLS Policy for uploading (Run after creating bucket)
-- This allows authenticated users to upload to their own folder

-- Note: You need to create the bucket first in Supabase Dashboard:
-- Storage -> New Bucket -> Name: "item-images" -> Public: Yes

-- Then apply these policies in SQL Editor:

-- Policy: Users can upload to their own folder
-- CREATE POLICY "Users can upload their own images"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--         bucket_id = 'item-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy: Anyone can view images (public bucket)
-- CREATE POLICY "Public can view images"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'item-images');

-- Policy: Users can delete their own images
-- CREATE POLICY "Users can delete their own images"
--     ON storage.objects
--     FOR DELETE
--     USING (
--         bucket_id = 'item-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- =====================================================
-- IMPORTANT DOCUMENTS - Separate Table
-- =====================================================
-- This is a SEPARATE module from regular items
-- Images are stored for reference only (no OCR/image learning)
-- Retrieval is text-based only

-- Create documents table (SEPARATE from items table)
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'id', 'certificate', 'receipt', 'contract', 'medical', 'financial', 'warranty', 'insurance', 'other'
    description TEXT,
    tags TEXT, -- Comma-separated tags for text-based search
    image_url TEXT, -- Stored for reference only, no OCR
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS documents_document_name_idx ON documents(document_name);
CREATE INDEX IF NOT EXISTS documents_document_type_idx ON documents(document_type);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own documents
CREATE POLICY "Users can view their own documents"
    ON documents
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert their own documents"
    ON documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own documents"
    ON documents
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
    ON documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- Storage Bucket for Document Images
-- =====================================================

-- Bucket: document-images
-- Settings:
--   - Public: true (allows public read access)
--   - File size limit: 10MB
--   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- Note: Create the bucket in Supabase Dashboard:
-- Storage -> New Bucket -> Name: "document-images" -> Public: Yes

-- Then apply these policies:

-- Policy: Users can upload to their own folder
-- CREATE POLICY "Users can upload their own document images"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--         bucket_id = 'document-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy: Anyone can view document images (public bucket)
-- CREATE POLICY "Public can view document images"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'document-images');

-- Policy: Users can delete their own document images
-- CREATE POLICY "Users can delete their own document images"
--     ON storage.objects
--     FOR DELETE
--     USING (
--         bucket_id = 'document-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );
