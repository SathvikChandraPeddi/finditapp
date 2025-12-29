import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HowItWorksSection = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            y: 100,
            opacity: 0,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=100',
              end: 'top center',
              scrub: 1
            }
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const steps = [
    {
      number: '01',
      title: 'Capture the Item',
      description: 'Take a quick photo or upload an image of what you want to remember.',
      icon: '📸',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'Tell Where You Kept It',
      description: 'Describe the location in your own words. AI understands natural language.',
      icon: '📍',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      number: '03',
      title: 'Ask Later, Instantly Recall',
      description: 'Just ask "Where are my keys?" and FindIt AI tells you immediately.',
      icon: '🔍',
      color: 'from-teal-500 to-green-500'
    }
  ]

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to never lose anything again
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              ref={el => cardsRef.current[index] = el}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                rotateX: 5
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Number */}
              <div className="text-6xl font-bold text-primary-cyan/20 mb-4">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {/* Hover glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-cyan/0 via-primary-cyan/20 to-primary-cyan/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
