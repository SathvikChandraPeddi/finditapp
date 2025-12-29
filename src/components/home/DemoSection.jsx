import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DemoSection = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [searching, setSearching] = useState(false)

  const simulateUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setCurrentStep(1)
    }, 2000)
  }

  const simulateSearch = () => {
    setSearching(true)
    setTimeout(() => {
      setSearching(false)
      setCurrentStep(2)
    }, 2000)
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            See It In <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-gray-400">
            Interactive demo - Click to experience
          </p>
        </motion.div>

        {/* Demo interface */}
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-3xl -z-10" />

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-4">Upload an Item</h3>
                  <p className="text-gray-400">Let's store your house keys</p>
                </div>

                {/* Upload area */}
                <div 
                  onClick={simulateUpload}
                  className="border-2 border-dashed border-primary-cyan/30 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-cyan/60 hover:bg-primary-cyan/5 transition-all group"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-6xl mx-auto mb-4"
                    >
                      ⏳
                    </motion.div>
                  ) : (
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                  )}
                  <div className="text-xl font-semibold mb-2">
                    {uploading ? 'Processing image...' : 'Click to upload image'}
                  </div>
                  <div className="text-gray-400">
                    {uploading ? 'AI is detecting the object' : 'or drag and drop'}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="text-5xl">🔑</div>
                  <div className="text-left">
                    <div className="text-sm text-primary-cyan">Detected Object</div>
                    <div className="text-2xl font-bold">House Keys</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Kitchen counter, near the coffee maker"
                    className="w-full bg-white/5 border border-primary-cyan/30 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-primary-cyan transition-all"
                    defaultValue="Kitchen counter, near the coffee maker"
                  />
                  <motion.button
                    onClick={simulateSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary-cyan to-blue-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-cyan/50 transition-all"
                  >
                    Save Location
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-3xl font-bold mb-2">Item Saved!</h3>
                  <p className="text-gray-400">Now try finding it...</p>
                </div>

                {/* Search simulation */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-primary-blue/30 rounded-xl">
                    <div className="text-2xl">💬</div>
                    <div className="text-lg">"Where are my house keys?"</div>
                  </div>

                  {searching ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-3 p-4"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🤖
                      </motion.div>
                      <div className="text-gray-400">AI is thinking...</div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3 p-4 bg-primary-cyan/10 rounded-xl border border-primary-cyan/30"
                    >
                      <div className="text-2xl">🤖</div>
                      <div>
                        <div className="font-semibold mb-2 text-primary-cyan">Found it!</div>
                        <div className="text-gray-300 mb-3">
                          Your <strong>house keys</strong> are on the <strong>kitchen counter, near the coffee maker</strong>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <div>🔑</div>
                          <div>Added 2 days ago</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentStep(0)
                    setSearching(false)
                  }}
                  className="w-full border border-primary-cyan/30 text-primary-cyan font-semibold py-3 rounded-xl hover:bg-primary-cyan/10 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default DemoSection
