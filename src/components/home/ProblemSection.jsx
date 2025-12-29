import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ProblemSection = () => {
  const sectionRef = useRef(null)
  const objectsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Objects drift away
      objectsRef.current.forEach((obj, index) => {
        if (obj) {
          gsap.to(obj, {
            x: index % 2 === 0 ? -300 : 300,
            y: -200,
            opacity: 0,
            rotation: index % 2 === 0 ? -180 : 180,
            filter: 'blur(10px)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: 1
            }
          })
        }
      })

      // Darken scene
      gsap.to('.problem-overlay', {
        opacity: 0.7,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1
        }
      })

      // Text reveal
      gsap.from('.problem-text', {
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

  const driftingObjects = ['🔑', '👛', '📱', '💳', '🎧']

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative">
      {/* Dark overlay */}
      <div className="problem-overlay absolute inset-0 bg-black opacity-0 pointer-events-none" />

      {/* Drifting objects */}
      <div className="absolute inset-0 overflow-hidden">
        {driftingObjects.map((emoji, index) => (
          <div
            key={index}
            ref={el => objectsRef.current[index] = el}
            className="absolute text-6xl opacity-40"
            style={{
              top: `${20 + index * 15}%`,
              left: `${30 + index * 10}%`,
              filter: 'blur(2px)'
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="problem-text text-center z-10 px-6 max-w-4xl">
        <motion.h2
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          We waste <span className="text-red-400">precious time</span>
          <br />
          searching for things we <span className="gradient-text">already own</span>
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-6"
        >
          5 minutes here. 10 minutes there.
        </motion.p>

        <motion.p
          className="text-2xl md:text-3xl font-semibold text-gray-300"
        >
          That's 60+ hours a year lost to forgetfulness.
        </motion.p>
      </div>
    </section>
  )
}

export default ProblemSection
