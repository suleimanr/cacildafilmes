import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 border-4 border-green-500 rounded-full"
        animate={{
          rotate: 360,
          borderRadius: ["50%", "0%", "50%"],
        }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </motion.div>
  )
}

