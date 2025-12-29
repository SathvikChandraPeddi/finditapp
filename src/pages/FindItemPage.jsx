import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { findItem, getItemSuggestions } from '../lib/items'

const FindItemPage = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [multipleResults, setMultipleResults] = useState(null)
  const [error, setError] = useState('')
  const [isListening, setIsListening] = useState(false)
  
  // Auto-suggestions state
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      const searchTerm = extractItemName(query)
      if (searchTerm.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoadingSuggestions(true)
      const result = await getItemSuggestions(searchTerm)
      if (result.success && result.data.length > 0) {
        setSuggestions(result.data)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
      setLoadingSuggestions(false)
    }

    const debounceTimer = setTimeout(fetchSuggestions, 150)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSuggestion = (item) => {
    setQuery(item.item_name)
    setShowSuggestions(false)
    setSuggestions([])
    // Directly show the result
    setResult(item)
    setMultipleResults(null)
    setError('')
  }

  const extractItemName = (query) => {
    // Simple NLP: Remove common question words and extract the item
    const lowerQuery = query.toLowerCase()
    const patterns = [
      /where (?:is|are|did i put|can i find) (?:my |the )?(.+?)[\?\.!]?$/i,
      /find (?:my |the )?(.+?)[\?\.!]?$/i,
      /locate (?:my |the )?(.+?)[\?\.!]?$/i,
      /(?:my |the )?(.+?)[\?\.!]?$/i
    ]
    
    for (const pattern of patterns) {
      const match = lowerQuery.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    return query.trim()
  }

  const handleSearch = async (event) => {
    if (event) {
      event.preventDefault()
    }
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    // Hide suggestions when searching
    setShowSuggestions(false)
    setSuggestions([])
    
    setLoading(true)
    setError('')
    setResult(null)
    setMultipleResults(null)

    const itemName = extractItemName(query)
    
    const searchResult = await findItem(itemName)

    if (searchResult.success) {
      const items = searchResult.data
      
      // Check if multiple items found
      if (Array.isArray(items) && items.length > 1) {
        setMultipleResults(items)
      } else if (Array.isArray(items) && items.length === 1) {
        setResult(items[0])
      } else if (!Array.isArray(items)) {
        setResult(items)
      } else {
        setError(`I couldn't find "${itemName}". Try different keywords or add it first.`)
      }
    } else {
      setError(searchResult.error || `No items found matching "${itemName}". Try using different keywords or add this item first.`)
    }

    setLoading(false)
  }

  const handleSelectItem = (item) => {
    setMultipleResults(null)
    setResult(item)
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        setError('Voice input failed. Please try again.')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      setError('Voice input is not supported in your browser')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
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
              🔍
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your <span className="gradient-text">Item</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Ask naturally and let AI instantly locate your stored items
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-4 sm:p-6 border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <div 
                    ref={inputRef}
                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-primary-cyan/10 focus-within:border-primary-cyan/50 transition-all"
                  >
                    <span className="text-2xl">💬</span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Where are my keys? / Find my wallet..."
                      className="flex-1 bg-transparent text-base sm:text-lg focus:outline-none placeholder-gray-500"
                      autoComplete="off"
                    />
                    {loadingSuggestions && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-cyan border-t-transparent rounded-full"
                      />
                    )}
                  </div>
                  
                  {/* Auto-suggestions dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-dark-200/95 backdrop-blur-xl rounded-xl border border-primary-cyan/30 shadow-2xl shadow-primary-cyan/10 overflow-hidden z-50"
                      >
                        <div className="p-2 border-b border-white/5">
                          <span className="text-xs text-gray-400 px-2">Suggestions ({suggestions.length})</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {suggestions.map((item, index) => (
                            <motion.button
                              key={item.id}
                              type="button"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => handleSelectSuggestion(item)}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary-cyan/10 transition-colors text-left group"
                            >
                              {item.image_url ? (
                                <img 
                                  src={item.image_url} 
                                  alt={item.item_name}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center text-xl">
                                  📦
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white group-hover:text-primary-cyan transition-colors truncate">
                                  {item.item_name}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  📍 {item.location}
                                </div>
                              </div>
                              <span className="text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    whileHover={{ scale: isListening ? 1 : 1.05 }}
                    whileTap={{ scale: isListening ? 1 : 0.95 }}
                    className={`p-3 sm:p-4 rounded-xl transition-all border ${
                      isListening 
                        ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                        : 'hover:bg-white/10 border-primary-cyan/30 hover:border-primary-cyan/50'
                    }`}
                    title="Voice input"
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🎤
                      </motion.div>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={loading || !query.trim()}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-cyan to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      loading || !query.trim() 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-lg hover:shadow-primary-cyan/30'
                    }`}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <span>🔍</span>
                        <span>Find</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </form>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-2xl p-12 text-center border border-primary-cyan/20"
              >
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-7xl mb-6 inline-block"
                >
                  🤖
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-400"
                >
                  Scanning your stored items...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-2xl p-8 border border-red-500/40 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  ❌
                </motion.div>
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <motion.button
                  onClick={() => setError('')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-cyan to-blue-500 text-white rounded-xl font-bold"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Single Result */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                {/* Success header */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold gradient-text"
                  >
                    Found it!
                  </motion.h2>
                </div>

                {/* Result card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-2xl p-6 sm:p-8 space-y-6 border border-primary-cyan/30"
                >
                  {/* Image if available */}
                  {result.image_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative group"
                    >
                      <img
                        src={result.image_url}
                        alt={result.item_name}
                        className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  )}

                  {/* Item details */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start gap-4 p-4 bg-primary-cyan/5 rounded-xl border border-primary-cyan/20"
                    >
                      <div className="text-4xl">📦</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-2">Item Name</div>
                        <div className="text-2xl md:text-3xl font-bold text-primary-cyan">
                          {result.item_name}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20"
                    >
                      <div className="text-4xl">📍</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-2">Location</div>
                        <div className="text-lg md:text-xl text-gray-200 leading-relaxed">
                          {result.location}
                        </div>
                      </div>
                    </motion.div>

                    {/* Metadata */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap gap-4 text-sm text-gray-500 pt-4 border-t border-white/10"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                        <span>📅</span>
                        <span>Added {new Date(result.created_at).toLocaleDateString()}</span>
                      </div>
                      {result.category && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                          <span>🏷️</span>
                          <span>{result.category}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                {/* New search button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => {
                    setQuery('')
                    setResult(null)
                    setError('')
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border-2 border-primary-cyan/40 text-primary-cyan font-bold py-4 rounded-xl hover:bg-primary-cyan/10 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔍</span>
                  <span>Search for Another Item</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple Results */}
          <AnimatePresence>
            {multipleResults && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    🎯
                  </motion.div>
                  <h2 className="text-3xl font-bold gradient-text mb-2">Multiple Items Found</h2>
                  <p className="text-gray-400">Select the item you're looking for</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {multipleResults.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="glass rounded-xl p-6 border border-primary-cyan/20 hover:border-primary-cyan/50 transition-all text-left"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.item_name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-primary-cyan mb-2">{item.item_name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{item.location}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default FindItemPage
