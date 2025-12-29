import { supabase } from './supabase'
import { uploadImage, deleteImage } from './storage'

/**
 * Add a new item to the database
 * @param {Object} itemData - The item data
 * @param {string} itemData.item_name - Name of the item
 * @param {string} itemData.location - Location where item is stored
 * @param {string} itemData.category - Optional category
 * @param {File} itemData.image - Optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const addItem = async (itemData) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to add items.')

    // Validate required inputs
    if (!itemData.item_name?.trim()) {
      throw new Error('Item name is required.')
    }
    if (!itemData.location?.trim()) {
      throw new Error('Location description is required.')
    }

    let imageUrl = null

    // Upload image if provided
    if (itemData.image) {
      // Validate image file
      if (!itemData.image.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image file (PNG, JPG, GIF).')
      }
      if (itemData.image.size > 5 * 1024 * 1024) {
        throw new Error('Image file is too large. Maximum size is 5MB.')
      }

      const uploadResult = await uploadImage(itemData.image, user.id)
      if (!uploadResult.success) {
        throw new Error(`Image upload failed: ${uploadResult.error || 'Unknown error'}`)
      }
      imageUrl = uploadResult.url
    }

    // Insert item into database
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          user_id: user.id,
          item_name: itemData.item_name.trim(),
          location: itemData.location.trim(),
          category: itemData.category?.trim() || null,
          image_url: imageUrl
        }
      ])
      .select()
      .single()

    if (error) throw new Error(error.message || 'Failed to save item to database.')

    return {
      success: true,
      data: data
    }

  } catch (error) {
    console.error('Add item error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while adding the item.'
    }
  }
}

/**
 * Get all items for the current user
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getAllItems = async () => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to view items.')

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Items table not found. Please contact support.')
      }
      throw new Error(`Failed to load items: ${error.message}`)
    }

    return {
      success: true,
      data: data || []
    }

  } catch (error) {
    console.error('Get all items error:', error)
    return {
      success: false,
      error: error.message || 'Failed to load items. Please try again.'
    }
  }
}

/**
 * Search for items by name or keywords
 * @param {string} query - Search query
 * @returns {Promise<{success: boolean, data?: object|array, error?: string}>}
 */
export const findItem = async (query) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to search for items.')

    // Validate input
    if (!query?.trim()) {
      throw new Error('Please enter what you\'re looking for.')
    }

    // Extract keywords (simple split by spaces)
    const keywords = query.toLowerCase().trim().split(/\s+/)

    // Search for items matching any keyword
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Items table not found. Please contact support.')
      }
      throw new Error(`Search failed: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return { 
        success: false, 
        error: 'You haven\'t added any items yet. Add items first to search for them.' 
      }
    }

    // Filter items that match any keyword
    const matchedItems = data.filter(item => {
      const itemNameLower = item.item_name.toLowerCase()
      const locationLower = item.location.toLowerCase()
      const categoryLower = (item.category || '').toLowerCase()
      
      return keywords.some(keyword => 
        itemNameLower.includes(keyword) || 
        locationLower.includes(keyword) ||
        categoryLower.includes(keyword)
      )
    })

    if (matchedItems.length === 0) {
      throw new Error('No items found matching your search.')
    }

    return {
      success: true,
      data: matchedItems.length === 1 ? matchedItems[0] : matchedItems
    }

  } catch (error) {
    console.error('Find item error:', error)
    return {
      success: false,
      error: error.message || 'Failed to search for items. Please try again.'
    }
  }
}

/**
 * Delete an item by ID
 * @param {string} itemId - The item ID to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteItem = async (itemId) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to delete items.')

    // Validate input
    if (!itemId) {
      throw new Error('Item ID is required.')
    }

    // Get item to delete image
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', itemId)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('Item not found or already deleted.')
      }
      throw new Error(`Failed to find item: ${fetchError.message}`)
    }

    if (!item) {
      throw new Error('Item not found. It may have already been deleted.')
    }

    // Delete image from storage if exists
    if (item.image_url) {
      const deleteImageResult = await deleteImage(item.image_url)
      if (!deleteImageResult.success) {
        console.warn('Failed to delete image from storage:', deleteImageResult.error)
        // Continue with item deletion even if image deletion fails
      }
    }

    // Delete item from database
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to delete item: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting item:', error)
    
    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Network error. Please check your internet connection and try again.' 
      }
    }
    
    return { success: false, error: error.message || 'Failed to delete item. Please try again.' }
  }
}

/**
 * Get real-time item suggestions as user types
 * Triggers after 2-3 characters, case-insensitive partial match
 * @param {string} query - Search query (minimum 2 characters)
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getItemSuggestions = async (query) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, data: [] }
    }

    // Require minimum 2 characters
    const searchTerm = query?.trim().toLowerCase()
    if (!searchTerm || searchTerm.length < 2) {
      return { success: true, data: [] }
    }

    // Get all user's items
    const { data, error } = await supabase
      .from('items')
      .select('id, item_name, location, category, image_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, data: [] }
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] }
    }

    // Case-insensitive partial match across item_name, location, category
    const suggestions = data.filter(item => {
      const itemName = (item.item_name || '').toLowerCase()
      const location = (item.location || '').toLowerCase()
      const category = (item.category || '').toLowerCase()
      
      return itemName.includes(searchTerm) || 
             location.includes(searchTerm) ||
             category.includes(searchTerm)
    }).slice(0, 8) // Limit to 8 suggestions

    return {
      success: true,
      data: suggestions
    }

  } catch (error) {
    console.error('Get item suggestions error:', error)
    return { success: false, data: [] }
  }
}
