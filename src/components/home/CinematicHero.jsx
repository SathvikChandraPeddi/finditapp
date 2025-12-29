import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HeroSection = () => {
  const sectionRef = useRef(null)
  const objectsRef = useRef([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return // Disable heavy animations on mobile

    const ctx = gsap.context(() => {
      // Animate floating objects
      objectsRef.current.forEach((obj, index) => {
        if (obj) {
          gsap.to(obj, {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            rotation: 'random(-15, 15)',
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          })
        }
      })

      // Background zoom effect
      gsap.to(sectionRef.current, {
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const objects = [
    { emoji: '🔑', top: '20%', left: '15%' },
    { emoji: '👓', top: '35%', right: '20%' },
    { emoji: '📱', top: '60%', left: '25%' },
    { emoji: '💼', top: '50%', right: '15%' },
    { emoji: '⌚', top: '75%', left: '40%' },
    { emoji: '🎧', top: '25%', right: '35%' }
  ]

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-dark via-primary-dark to-blue-900"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(77,208,225,0.1),transparent_50%)]" />
      </div>

      {/* Floating objects */}
      {objects.map((obj, index) => (
        <div
          key={index}
          ref={(el) => (objectsRef.current[index] = el)}
          className="absolute text-6xl md:text-8xl opacity-20 pointer-events-none"
          style={{
            top: obj.top,
            left: obj.left,
            right: obj.right
          }}
        >
          {obj.emoji}
        </div>
      ))}

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
        >
          You remember <span className="gradient-text">everything</span>
          <br />
          <span className="text-gray-400">…until you don't.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-400 mb-12"
        >
          Never lose track of your belongings again
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-dark to-transparent" />
    </div>
  )
}

export default HeroSection
