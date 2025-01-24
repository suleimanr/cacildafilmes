import type React from "react"
import { useState, useEffect } from "react"

interface OpenAIAssistantProps {
  onMessageSent: (message: string) => void
}

const OpenAIAssistant: React.FC<OpenAIAssistantProps> = ({ onMessageSent }) => {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const placeholders = [
    "Pergunte sobre nossos serviços...",
    "Quer saber mais sobre nosso portfólio?",
    "Conheça nossos trabalhos...",
    "Veja nossos vídeos...",
    "Entre em contato conosco...",
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    }, 3000) // Muda a cada 3 segundos

    return () => clearInterval(intervalId)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    onMessageSent(input)
    setInput("")
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="flex items-center border-2 border-white rounded-none overflow-hidden bg-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholders[placeholderIndex]}
          className="appearance-none bg-transparent border-none w-full text-white px-3 py-2 leading-tight focus:outline-none text-sm font-mono placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-white hover:bg-gray-200 text-black text-sm py-2 px-4 transition-colors duration-200 font-mono uppercase"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Ação"}
        </button>
      </div>
    </form>
  )
}

export default OpenAIAssistant

