import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    company: "Tech Innovations Ltda.",
    content: "A Punch Conteúdo transformou nossa abordagem de treinamento corporativo. O conteúdo é envolvente e os resultados são impressionantes!"
  },
  {
    id: 2,
    name: "João Santos",
    company: "Finanças Futuro S.A.",
    content: "A criatividade e a qualidade do material produzido pela Punch Conteúdo elevaram significativamente o engajamento de nossa equipe nos treinamentos."
  },
  {
    id: 3,
    name: "Ana Oliveira",
    company: "Inova Saúde",
    content: "Estamos extremamente satisfeitos com a parceria com a Punch Conteúdo. Seus treinamentos sob medida fizeram toda a diferença em nossa organização."
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">O que nossos clientes dizem</h2>
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-700 p-8 rounded-lg shadow-xl"
            >
              <p className="text-xl mb-4">{testimonials[currentIndex].content}</p>
              <p className="font-semibold">{testimonials[currentIndex].name}</p>
              <p className="text-blue-400">{testimonials[currentIndex].company}</p>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-blue-500 text-white p-2 rounded-full"
          >
            &#8592;
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full bg-blue-500 text-white p-2 rounded-full"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  )
}

