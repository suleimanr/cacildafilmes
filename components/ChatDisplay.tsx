import type React from "react"
import { useEffect, useRef } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"
import VideoPlayer from "./VideoPlayer"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatDisplayProps {
  messages: Message[]
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    controls.start("visible")
  }, [messages, controls])

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[highlight\].*?\[\/highlight\]|\[portfolio=.*?\])/g)
    return parts.map((part, i) => {
      if (part.startsWith("[highlight]") && part.endsWith("[/highlight]")) {
        return <SceneHeading key={i} text={part.slice(10, -11)} />
      } else if (part.startsWith("[portfolio=") && part.endsWith("]")) {
        const videoId = part.slice(11, -1)
        return (
          <div key={i} className="my-8 w-full">
            <VideoPlayer videoId={videoId} />
          </div>
        )
      } else if (part.startsWith("/whatsapp")) {
        const phoneNumber = part.slice(9).trim()
        const whatsappLink = `https://wa.me/5511948878572?text=Olá,%20meu%20número%20é%20${phoneNumber}.%20Gostaria%20de%20mais%20informações%20sobre%20os%20serviços%20da%20Punch%20Conteúdo.`
        return (
          <a
            key={i}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline transition-colors"
            onClick={(e) => {
              e.preventDefault()
              window.open(whatsappLink, "_blank")
            }}
          >
            Clique aqui para abrir o WhatsApp
          </a>
        )
      } else {
        return <ScriptText key={i} text={part} />
      }
    })
  }

  const messageVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="absolute inset-0 overflow-y-auto p-8 pb-20 pointer-events-auto bg-black">
      <div className="max-w-4xl mx-auto font-mono">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            className={`mb-12 ${message.role === "user" ? "pl-16" : ""}`}
          >
            {message.role === "user" && <div className="uppercase text-white mb-2 tracking-wider">USUÁRIO:</div>}
            <div className="leading-relaxed text-white">{renderMessageContent(message.content)}</div>
          </motion.div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

const SceneHeading: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.h2
      className="uppercase text-3xl font-bold mb-4 tracking-widest text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {text}
    </motion.h2>
  )
}

const ScriptText: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(" ")

  return (
    <p className="mb-4">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.05 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default ChatDisplay

