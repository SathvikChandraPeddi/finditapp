import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ClosingSection = () => {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = gsap.context(() => {
      // Text fade in
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 1
          }
        }
      )

      // Floating particles
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          gsap.to(particle, {
            y: 'random(-40, 40)',
            x: 'random(-40, 40)',
            rotation: 'random(-180, 180)',
            duration: 'random(8, 12)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: ['✨', '🌟', '💫', '⭐'][i % 4],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`
  }))

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-primary-dark to-blue-900 overflow-hidden"
    >
      {/* Calm background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(77,208,225,0.15),transparent_70%)]" />
      </div>

      {/* Floating particles */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          ref={(el) => (particlesRef.current[index] = el)}
          className="absolute text-2xl md:text-4xl opacity-20 pointer-events-none"
          style={{
            top: particle.top,
            left: particle.left
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-7xl md:text-8xl mb-8"
          >
            🧘
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Less <span className="text-red-400">stress</span>.
            <br />
            More <span className="gradient-text">focus</span>.
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop wasting mental energy on remembering locations.
            <br />
            Let FindIt AI do the heavy lifting.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-primary-cyan to-blue-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-primary-cyan/50 hover:shadow-primary-cyan/70 transition-all"
            >
              Get Started Free
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-primary-cyan/50 text-primary-cyan font-semibold text-lg rounded-xl hover:bg-primary-cyan/10 transition-all"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Small tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-16 text-gray-500 text-sm"
          >
            Your mind deserves better than being a storage unit
          </motion.p>
        </motion.div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900 to-transparent" />
    </div>
  )
}

export default ClosingSection
