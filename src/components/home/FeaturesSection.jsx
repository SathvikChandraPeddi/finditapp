import { motion } from 'framer-motion'

const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Image Recognition',
      description: 'Advanced computer vision automatically identifies objects in your photos',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🧠',
      title: 'Smart Memory Storage',
      description: 'Intelligent database that organizes and indexes all your items',
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: '⚡',
      title: 'Instant Recall',
      description: 'Natural language search finds your items in milliseconds',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: '🔒',
      title: 'Privacy Focused',
      description: 'All data stored locally on your device. Nothing leaves your computer',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary-cyan/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built with cutting-edge AI technology to make your life easier
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="glass rounded-2xl p-8 relative group cursor-pointer overflow-hidden"
            >
              {/* Hover glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className="text-6xl mb-6 inline-block"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(45deg, transparent, ${feature.gradient.includes('blue') ? '#4DD0E1' : '#26C6DA'}, transparent)`,
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
