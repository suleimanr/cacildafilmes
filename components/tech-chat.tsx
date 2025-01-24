import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMessage {
  type: 'question' | 'answer'
  content: string
}

const chatData: ChatMessage[] = [
  { type: 'question', content: 'O que é a Punch Conteúdo?' },
  { type: 'answer', content: 'Produtora de educação corporativa inovadora' },
  { type: 'question', content: 'Como a Punch inova?' },
  { type: 'answer', content: 'Tecnologia avançada e design criativo' },
  { type: 'question', content: 'Principais serviços?' },
  { type: 'answer', content: 'Treinamentos personalizados e e-learning' },
  { type: 'question', content: 'Diferencial da Punch?' },
  { type: 'answer', content: 'Experiências de aprendizado únicas' },
]

const TechChat: React.FC<{ spherePosition: { x: number; y: number } }> = ({ spherePosition }) => {
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([])
  const [typingIndex, setTypingIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessages(prev => {
        if (prev.length < chatData.length) {
          return [...prev, chatData[prev.length]]
        }
        return chatData.slice(prev.length % chatData.length)
      })
      setTypingIndex(prev => (prev + 1) % chatData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {activeMessages.map((message, index) => {
          const position = getPosition(index, activeMessages.length)
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: spherePosition.x + position.x,
                y: spherePosition.y + position.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 10,
                duration: 0.5 
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 max-w-xs text-center p-4 rounded-lg ${
                message.type === 'question' ? 'bg-blue-500 bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
              }`}
            >
              {typingIndex === index && message.type === 'question' ? (
                <TypewriterText content={message.content} />
              ) : (
                <p className={`font-bold ${
                  message.type === 'question' ? 'text-blue-300 text-lg' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-xl'
                }`}>
                  {message.content}
                </p>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

const TypewriterText: React.FC<{ content: string }> = ({ content }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < content.length) {
        setDisplayedText(prev => prev + content[i])
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [content])

  return (
    <p className="font-bold text-blue-300 text-lg">
      {displayedText}
    </p>
  )
}

export default TechChat

