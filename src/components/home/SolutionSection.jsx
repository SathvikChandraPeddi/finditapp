import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SolutionSection = () => {
  const sectionRef = useRef(null)
  const roomRef = useRef(null)
  const appFrameRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scene sharpens
      gsap.to('.blur-layer', {
        filter: 'blur(0px)',
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1
        }
      })

      // Object comes into focus
      gsap.from(roomRef.current, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(20px)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1
        }
      })

      // App frame fades in
      gsap.from(appFrameRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: 'bottom center',
          scrub: 1
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative">
      {/* Clearing overlay */}
      <div className="blur-layer absolute inset-0 bg-gradient-to-b from-primary-blue to-primary-dark opacity-80" style={{ filter: 'blur(20px)' }} />

      {/* Content */}
      <div className="text-center z-10 px-6 max-w-6xl">
        {/* Clean room visualization */}
        <div ref={roomRef} className="mb-16">
          <div className="relative inline-block">
            <div className="text-8xl mb-4 animate-breathe">🔑</div>
            <motion.div
              className="absolute -inset-4 bg-primary-cyan/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Solution text */}
        <motion.h2
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          <span className="gradient-text">FindIt AI</span>
          <br />
          remembers for you.
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12"
        >
          Your personal memory assistant that never forgets.
        </motion.p>

        {/* App frame */}
        <div ref={appFrameRef} className="glass rounded-2xl p-8 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-primary-cyan/30">
              <div className="text-3xl">📸</div>
              <div className="text-left">
                <div className="font-semibold text-sm text-primary-cyan">Capture</div>
                <div className="text-xs text-gray-400">Snap a photo of your item</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-primary-cyan/30">
              <div className="text-3xl">📍</div>
              <div className="text-left">
                <div className="font-semibold text-sm text-primary-cyan">Store</div>
                <div className="text-xs text-gray-400">Tell us where you put it</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-primary-cyan/30">
              <div className="text-3xl">🔍</div>
              <div className="text-left">
                <div className="font-semibold text-sm text-primary-cyan">Recall</div>
                <div className="text-xs text-gray-400">Ask and find it instantly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionSection
