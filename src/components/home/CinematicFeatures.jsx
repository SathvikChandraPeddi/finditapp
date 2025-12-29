import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FeaturesSection = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: 15 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1
              }
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: '🧠',
      title: 'Smart Memory Storage',
      description: 'AI-powered categorization and intelligent search algorithms remember every detail',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: '📸',
      title: 'Image-Backed Recall',
      description: 'Visual memory aids help you instantly recognize what you\'re looking for',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: '💬',
      title: 'Natural Language Queries',
      description: 'Ask questions naturally - no complex commands or rigid syntax required',
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      icon: '🔒',
      title: 'Privacy-First Design',
      description: 'Your data stays secure with encrypted storage and user-only access controls',
      gradient: 'from-orange-500/20 to-red-500/20'
    }
  ]

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-b from-primary-dark via-black to-gray-900 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(77, 208, 225, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 208, 225, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to stay organized and stress-free
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`glass rounded-3xl p-8 h-full border border-white/10 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl`}
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.5
                  }}
                  className="text-7xl mb-6"
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {feature.description}
                </p>

                {/* Accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="mt-6 h-1 bg-gradient-to-r from-primary-cyan to-transparent rounded-full origin-left"
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-lg">
            And many more features to discover...
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default FeaturesSection
