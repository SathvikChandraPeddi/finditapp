import { supabase } from './supabase'

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user's ID for folder organization
 * @param {string} bucket - The storage bucket to upload to (default: 'item-images')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImage = async (file, userId, bucket = 'item-images') => {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file provided.')
    }
    if (!userId) {
      throw new Error('User ID is required.')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only image files are allowed (PNG, JPG, GIF, WebP).')
    }

    // Validate file size (10MB limit for documents, 5MB for items)
    const maxSize = bucket === 'document-images' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error(`Image is too large. Maximum file size is ${bucket === 'document-images' ? '10MB' : '5MB'}.`)
    }

    // Validate file extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (!fileExt || !validExtensions.includes(fileExt)) {
      throw new Error(`Invalid file extension. Allowed types: ${validExtensions.join(', ').toUpperCase()}`)
    }

    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(uploadError.message || 'Failed to upload image to storage.')
    }

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    if (urlError) {
      throw new Error(urlError.message || 'Failed to generate image URL.')
    }

    const publicUrl = publicUrlData.publicUrl

    return {
      success: true,
      url: publicUrl
    }

  } catch (error) {
    console.error('Upload image error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image. Please try again.'
    }
  }
}

/**
 * Delete an image from Supabase Storage
 * @param {string} imageUrl - The full URL of the image to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return { success: true } // Nothing to delete
    }

    // Validate URL format
    if (!imageUrl.includes('/item-images/')) {
      throw new Error('Invalid image URL format.')
    }

    // Extract file path from URL
    const urlParts = imageUrl.split('/item-images/')
    if (urlParts.length < 2) {
      throw new Error('Could not parse image URL.')
    }
    const filePath = urlParts[1]

    if (!filePath) {
      throw new Error('Invalid file path extracted from URL.')
    }

    // Delete from storage
    const { error } = await supabase.storage
      .from('item-images')
      .remove([filePath])

    if (error) {
      // Don't throw error if file doesn't exist
      if (error.message.includes('not found')) {
        console.warn('Image file not found, may have been deleted already')
        return { success: true }
      }
      throw new Error(`Failed to delete image: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    
    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Network error. Could not delete image.' 
      }
    }
    
    return { success: false, error: error.message || 'Failed to delete image.' }
  }
}

/**
 * Get public URL for an image
 * @param {string} filePath - The storage path of the image
 * @returns {string} Public URL
 */
export const getImageUrl = (filePath) => {
  if (!filePath) return null
  
  const { data } = supabase.storage
    .from('item-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
