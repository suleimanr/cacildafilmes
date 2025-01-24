import { motion, AnimatePresence } from 'framer-motion'

interface InfoDisplayProps {
  info: {
    text: string
    highlight: string
  }
  isVisible: boolean
}

export default function InfoDisplay({ info, isVisible }: InfoDisplayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={info.text}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-80 p-8 rounded-lg backdrop-blur-md w-full max-w-4xl"
        >
          <motion.h2
            className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {info.text}
          </motion.h2>
          <motion.p
            className="text-3xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {info.highlight}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

