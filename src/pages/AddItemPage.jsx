import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addItem } from '../lib/items'

const AddItemPage = () => {
  const [itemName, setItemName] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    } else {
      setError('Please drop a valid image file')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!itemName || !location) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    const result = await addItem({
      item_name: itemName,
      location: location,
      category: category || null,
      image: imageFile
    })

    if (result.success) {
      setSuccess(true)
      setItemName('')
      setLocation('')
      setCategory('')
      setImageFile(null)
      setImagePreview(null)
      setTimeout(() => setSuccess(false), 2000)
    } else {
      setError(result.error || 'Failed to add item')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-7xl mb-4"
            >
              ➕
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Add <span className="gradient-text">New Item</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              Store your items with details for easy retrieval later
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-primary-cyan/10 hover:border-primary-cyan/30 transition-all"
            >
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span className="text-2xl">📸</span>
                <span>Item Photo</span>
                <span className="text-gray-500 text-sm font-normal">(Optional)</span>
              </label>
              
              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.div
                    key="preview"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative group"
                  >
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-72 object-cover rounded-xl shadow-2xl"
                    />
                    <motion.button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      ✓ Image ready to upload
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-primary-cyan bg-primary-cyan/5' 
                        : 'border-gray-700 hover:border-primary-cyan/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="space-y-4"
                    >
                      <div className="text-6xl">📷</div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-300">
                          Drop an image here or click to upload
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports: JPG, PNG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Item Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-primary-cyan/10 hover:border-primary-cyan/30 transition-all"
            >
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span className="text-2xl">🏷️</span>
                <span>Item Name</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., House Keys, Wallet, Phone Charger"
                className="w-full bg-white/5 border border-primary-cyan/30 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan focus:bg-white/10 transition-all placeholder:text-gray-600"
                required
              />
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-primary-cyan/10 hover:border-primary-cyan/30 transition-all"
            >
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span className="text-2xl">📍</span>
                <span>Location Description</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Kitchen counter near the coffee maker, Top drawer in the bedroom dresser"
                rows={4}
                className="w-full bg-white/5 border border-primary-cyan/30 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan focus:bg-white/10 transition-all resize-none placeholder:text-gray-600"
                required
              />
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <span>💡</span>
                <span>Be specific for better AI-powered recall</span>
              </div>
            </motion.div>

            {/* Category (Optional) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-primary-cyan/10 hover:border-primary-cyan/30 transition-all"
            >
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span className="text-2xl">📂</span>
                <span>Category</span>
                <span className="text-gray-500 text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Electronics, Accessories, Documents"
                className="w-full bg-white/5 border border-primary-cyan/30 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan focus:bg-white/10 transition-all placeholder:text-gray-600"
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/40 rounded-xl p-5 flex items-start gap-3 shadow-lg"
                >
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-red-400 mb-1">Error</div>
                    <div className="text-red-300/90">{error}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/40 rounded-xl p-8 text-center shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    ✅
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-2xl font-bold text-green-400 mb-2">Success!</div>
                    <div className="text-gray-400">Item saved successfully. You can now find it anytime using AI search.</div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-primary-cyan via-blue-500 to-primary-cyan bg-size-200 hover:bg-pos-100 text-white font-bold text-xl py-5 rounded-xl shadow-xl shadow-primary-cyan/50 hover:shadow-2xl hover:shadow-primary-cyan/70 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl relative overflow-hidden group"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              
              {loading ? (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-2xl"
                  >
                    ⏳
                  </motion.div>
                  <span>Uploading to Cloud...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>💾</span>
                  <span>Save Item</span>
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddItemPage