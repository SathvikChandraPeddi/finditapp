import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ProblemSection = () => {
  const sectionRef = useRef(null)
  const objectsRef = useRef([])
  const textRef = useRef(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = gsap.context(() => {
      // Objects drift away on scroll
      objectsRef.current.forEach((obj, index) => {
        if (obj) {
          gsap.to(obj, {
            x: index % 2 === 0 ? -200 : 200,
            y: -150,
            opacity: 0,
            rotation: index % 2 === 0 ? -45 : 45,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top center',
              end: 'center center',
              scrub: 1
            }
          })
        }
      })

      // Text fade in
      gsap.from(textRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const objects = [
    { emoji: '🔑', left: '20%' },
    { emoji: '📱', left: '45%' },
    { emoji: '👓', right: '25%' },
    { emoji: '💼', left: '65%' }
  ]

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-gray-900 to-black overflow-hidden"
    >
      {/* Drifting objects */}
      <div className="absolute inset-0">
        {objects.map((obj, index) => (
          <div
            key={index}
            ref={(el) => (objectsRef.current[index] = el)}
            className="absolute top-1/3 text-6xl md:text-7xl opacity-30"
            style={{ left: obj.left, right: obj.right }}
          >
            {obj.emoji}
          </div>
        ))}
      </div>

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/50 to-black" />

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white">
            Where did I put it?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-6">
            Searching wastes <span className="text-red-400">time</span> and{' '}
            <span className="text-red-400">mental energy</span>.
          </p>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Every forgotten item location creates friction in your day.
            The stress compounds. The minutes add up.
          </p>
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

export default ProblemSection
