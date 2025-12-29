import { supabase } from './supabase'
import { uploadImage, deleteImage } from './storage'

/**
 * Document types for Important Documents
 */
export const DOCUMENT_TYPES = [
  { value: 'id', label: 'ID / Government Document', icon: '🪪' },
  { value: 'certificate', label: 'Certificate', icon: '📜' },
  { value: 'receipt', label: 'Receipt / Invoice', icon: '🧾' },
  { value: 'contract', label: 'Contract / Agreement', icon: '📝' },
  { value: 'medical', label: 'Medical Record', icon: '🏥' },
  { value: 'financial', label: 'Financial Document', icon: '💳' },
  { value: 'warranty', label: 'Warranty / Guarantee', icon: '🛡️' },
  { value: 'insurance', label: 'Insurance Document', icon: '📋' },
  { value: 'other', label: 'Other', icon: '📄' }
]

/**
 * Add a new important document
 * @param {Object} docData - The document data
 * @param {string} docData.document_name - Name of the document
 * @param {string} docData.document_type - Type of document
 * @param {string} docData.notes - Optional notes
 * @param {File} docData.image - Optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const addDocument = async (docData) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to add documents.')

    // Validate required inputs
    if (!docData.document_name?.trim()) {
      throw new Error('Document name is required.')
    }
    if (!docData.document_type?.trim()) {
      throw new Error('Document type is required.')
    }

    let imageUrl = null

    // Upload image if provided (for reference only, no OCR)
    if (docData.image) {
      // Validate image file
      if (!docData.image.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image file (PNG, JPG, GIF).')
      }
      if (docData.image.size > 10 * 1024 * 1024) {
        throw new Error('Image file is too large. Maximum size is 10MB.')
      }

      const uploadResult = await uploadImage(docData.image, user.id, 'document-images')
      if (!uploadResult.success) {
        throw new Error(`Image upload failed: ${uploadResult.error || 'Unknown error'}`)
      }
      imageUrl = uploadResult.url
    }

    // Insert document into database (separate table from items)
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          user_id: user.id,
          document_name: docData.document_name.trim(),
          document_type: docData.document_type.trim(),
          notes: docData.notes?.trim() || null,
          image_url: imageUrl
        }
      ])
      .select()
      .single()

    if (error) throw new Error(error.message || 'Failed to save document to database.')

    return {
      success: true,
      data: data
    }

  } catch (error) {
    console.error('Add document error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while adding the document.'
    }
  }
}

/**
 * Get all documents for the current user
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getAllDocuments = async () => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to view documents.')

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Documents table not found. Please contact support.')
      }
      throw new Error(`Failed to load documents: ${error.message}`)
    }

    return {
      success: true,
      data: data || []
    }

  } catch (error) {
    console.error('Get all documents error:', error)
    return {
      success: false,
      error: error.message || 'Failed to load documents. Please try again.'
    }
  }
}

/**
 * Search for documents by text (name, type, description, tags)
 * NO OCR - purely text-based search
 * @param {string} query - Search query
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const findDocument = async (query) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to search for documents.')

    // Validate input
    if (!query?.trim()) {
      throw new Error('Please enter what you\'re looking for.')
    }

    const searchTerm = query.toLowerCase().trim()

    // Get all user's documents
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No documents stored yet.'
      }
    }

    // Text-based search across all fields
    const results = data.filter(doc => {
      const searchableText = `${doc.document_name} ${doc.document_type} ${doc.description || ''} ${doc.tags || ''}`.toLowerCase()
      return searchableText.includes(searchTerm)
    })

    return {
      success: true,
      data: results
    }

  } catch (error) {
    console.error('Find document error:', error)
    return {
      success: false,
      error: error.message || 'Search failed. Please try again.'
    }
  }
}

/**
 * Delete a document by ID
 * @param {string} docId - The document ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteDocument = async (docId) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to delete documents.')

    // Get document first to check ownership and get image URL
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !doc) {
      throw new Error('Document not found or access denied.')
    }

    // Delete image from storage if exists
    if (doc.image_url) {
      await deleteImage(doc.image_url)
    }

    // Delete document from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', docId)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(`Failed to delete document: ${deleteError.message}`)
    }

    return {
      success: true
    }

  } catch (error) {
    console.error('Delete document error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete document. Please try again.'
    }
  }
}

/**
 * Update a document
 * @param {string} docId - The document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateDocument = async (docId, updates) => {
  try {
    // Validate authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication failed. Please sign in again.')
    if (!user) throw new Error('You must be signed in to update documents.')

    const { data, error } = await supabase
      .from('documents')
      .update({
        document_name: updates.document_name?.trim(),
        document_type: updates.document_type?.trim(),
        notes: updates.notes?.trim() || null
      })
      .eq('id', docId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update document: ${error.message}`)
    }

    return {
      success: true,
      data: data
    }

  } catch (error) {
    console.error('Update document error:', error)
    return {
      success: false,
      error: error.message || 'Failed to update document. Please try again.'
    }
  }
}

/**
 * Get real-time document suggestions as user types
 * Triggers after 2-3 characters, case-insensitive partial match
 * @param {string} query - Search query (minimum 2 characters)
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getDocumentSuggestions = async (query) => {
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

    // Get all user's documents
    const { data, error } = await supabase
      .from('documents')
      .select('id, document_name, document_type, notes, image_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, data: [] }
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] }
    }

    // Case-insensitive partial match across document_name, document_type, notes
    const suggestions = data.filter(doc => {
      const docName = (doc.document_name || '').toLowerCase()
      const docType = (doc.document_type || '').toLowerCase()
      const notes = (doc.notes || '').toLowerCase()
      
      return docName.includes(searchTerm) || 
             docType.includes(searchTerm) ||
             notes.includes(searchTerm)
    }).slice(0, 8) // Limit to 8 suggestions

    return {
      success: true,
      data: suggestions
    }

  } catch (error) {
    console.error('Get document suggestions error:', error)
    return { success: false, data: [] }
  }
}
