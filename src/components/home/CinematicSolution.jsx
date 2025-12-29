import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SolutionSection = () => {
  const sectionRef = useRef(null)
  const blurRef = useRef(null)
  const appRef = useRef(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = gsap.context(() => {
      // Blur to focus transition
      gsap.fromTo(
        blurRef.current,
        { filter: 'blur(20px)', opacity: 0.5 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 1
          }
        }
      )

      // App reveal
      gsap.fromTo(
        appRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scale: 1,
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-primary-dark overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-cyan/20 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div ref={blurRef} className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="gradient-text">FindIt AI</span> remembers for you
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Your personal memory assistant that never forgets
          </p>
        </motion.div>

        {/* App UI Preview */}
        <div ref={appRef} className="relative max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary-cyan/20"
          >
            {/* Mock app interface */}
            <div className="space-y-6">
              {/* Search bar */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-primary-cyan/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🔍</div>
                  <div className="flex-1 text-left text-gray-400">
                    "Where are my keys?"
                  </div>
                  <div className="px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg text-sm font-semibold">
                    Find
                  </div>
                </div>
              </div>

              {/* Result */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-primary-cyan/20 to-blue-500/20 rounded-2xl p-6 border border-primary-cyan/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🔑</div>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-gray-400 mb-1">Found:</div>
                    <div className="text-xl font-bold text-primary-cyan mb-2">House Keys</div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <span>📍</span>
                      <span className="text-sm">Kitchen counter, near the coffee maker</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating accent */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-8 -right-8 text-6xl"
          >
            ✨
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-dark to-transparent" />
    </div>
  )
}

export default SolutionSection
