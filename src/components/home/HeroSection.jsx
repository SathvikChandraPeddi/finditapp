import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HeroSection = () => {
  const sectionRef = useRef(null)
  const objectsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating objects animation
      objectsRef.current.forEach((obj, index) => {
        if (obj) {
          gsap.to(obj, {
            y: -50,
            x: index % 2 === 0 ? 30 : -30,
            rotation: index % 2 === 0 ? 10 : -10,
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          })

          // Zoom on scroll
          gsap.to(obj, {
            scale: 1.3,
            opacity: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          })
        }
      })

      // Text reveal
      gsap.from('.hero-text', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const floatingObjects = [
    { emoji: '🔑', size: 'text-6xl', position: 'top-1/4 left-1/4' },
    { emoji: '👛', size: 'text-5xl', position: 'top-1/3 right-1/4' },
    { emoji: '📱', size: 'text-7xl', position: 'bottom-1/3 left-1/3' },
    { emoji: '🎧', size: 'text-5xl', position: 'top-2/3 right-1/3' },
    { emoji: '⌚', size: 'text-4xl', position: 'bottom-1/4 right-1/4' }
  ]

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Floating objects */}
      <div className="absolute inset-0">
        {floatingObjects.map((obj, index) => (
          <div
            key={index}
            ref={el => objectsRef.current[index] = el}
            className={`absolute ${obj.position} ${obj.size} opacity-60`}
            style={{ filter: 'blur(1px)' }}
          >
            {obj.emoji}
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="hero-text text-center z-10 px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            You remember <span className="gradient-text">everything</span>...
          </h1>
          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-gray-400">
            until you don't.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Your brain holds infinite memories, yet the keys are always missing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-sm text-gray-500 animate-bounce"
        >
          ↓ Scroll to explore
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
