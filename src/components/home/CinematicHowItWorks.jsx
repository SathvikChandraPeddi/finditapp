import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HowItWorksSection = () => {
  const sectionRef = useRef(null)
  const stepsRef = useRef([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(
            step,
            { opacity: 0, y: 100, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              scrollTrigger: {
                trigger: step,
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

  const steps = [
    {
      number: '01',
      title: 'Capture',
      description: 'Snap a photo or describe your item',
      icon: '📸',
      detail: 'Add your item with location details and optional image'
    },
    {
      number: '02',
      title: 'Save',
      description: 'Secure storage with smart categorization',
      icon: '💾',
      detail: 'Everything organized and searchable instantly'
    },
    {
      number: '03',
      title: 'Recall',
      description: 'Ask naturally, find instantly',
      icon: '🎯',
      detail: 'Natural language search brings it back in seconds'
    }
  ]

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-b from-primary-dark via-blue-900 to-primary-dark overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
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
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to never lose anything again
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepsRef.current[index] = el)}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="glass rounded-3xl p-8 h-full border border-primary-cyan/20 hover:border-primary-cyan/50 transition-all duration-300"
              >
                {/* Step number */}
                <div className="text-6xl font-bold text-primary-cyan/20 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3
                  }}
                  className="text-7xl mb-6"
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-3xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-400 mb-4">
                  {step.description}
                </p>
                <p className="text-sm text-gray-500">
                  {step.detail}
                </p>

                {/* Connection line (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="w-12 lg:w-16 h-0.5 bg-gradient-to-r from-primary-cyan to-transparent origin-left"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorksSection
