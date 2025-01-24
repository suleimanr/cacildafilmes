import type React from "react"
import { motion } from "framer-motion"

interface VideoPlayerProps {
  videoId: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="aspect-w-16 aspect-h-9 rounded-none overflow-hidden shadow-lg border-4 border-white"
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </motion.div>
  )
}

export default VideoPlayer

