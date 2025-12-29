import { motion } from 'framer-motion'

const EndingSection = () => {
  const organizedObjects = ['🔑', '👛', '📱', '🎧', '⌚', '💳', '🎒']

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Organized objects animation */}
        <div className="mb-16 relative">
          <div className="grid grid-cols-7 gap-4 justify-center mb-8">
            {organizedObjects.map((emoji, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }
                }}
                viewport={{ once: true }}
                className="text-5xl"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  {emoji}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Soft glow */}
          <motion.div
            className="absolute inset-0 bg-primary-cyan/20 blur-3xl rounded-full -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Less <span className="text-red-400">stress</span>.
            <br />
            More <span className="gradient-text">focus</span>.
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stop wasting mental energy on remembering where things are.
            Let AI handle it, so you can focus on what truly matters.
          </p>

          {/* Call to action */}
          <motion.div
            className="pt-8 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-primary-cyan to-blue-500 text-white font-bold text-xl rounded-xl shadow-lg shadow-primary-cyan/50 hover:shadow-2xl hover:shadow-primary-cyan/70 transition-all"
            >
              Start Using FindIt AI
            </motion.button>

            <div className="text-sm text-gray-500">
              Free • No sign-up required • Privacy focused
            </div>
          </motion.div>
        </motion.div>

        {/* Breathing background */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-cyan/10 to-transparent rounded-full blur-3xl -z-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  )
}

export default EndingSection
