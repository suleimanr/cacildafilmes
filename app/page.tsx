"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Layout from "@/components/layout"
import AnimatedSphere from "@/components/AnimatedSphere"
import Footer from "@/components/footer"
import { useConversation } from "@11labs/react"
import { config } from "@/lib/config"
import { Square, Phone } from "lucide-react"
import OpenAIAssistant from "@/components/OpenAIAssistant"
import ChatDisplay from "@/components/ChatDisplay"

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const [agentAudioData, setAgentAudioData] = useState<Uint8Array | null>(null)
  const [userAudioData, setUserAudioData] = useState<Uint8Array | null>(null)
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [isCallActive, setIsCallActive] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs", new Date().toISOString())
      setIsConversationActive(true)
      setIsCallActive(true)
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs", new Date().toISOString())
      setIsConversationActive(false)
      setIsCallActive(false)
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error, new Date().toISOString())
    },
    onMessage: (message) => {
      console.log("Received message:", message, new Date().toISOString())
      if (message.type === "audio") {
        processAgentAudio(message.audio)
      }
    },
  })

  useEffect(() => {
    let analyser: AnalyserNode | null = null
    let animationFrameId: number | null = null

    if (isCallActive) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyser = audioContextRef.current.createAnalyser()
      analyser.fftSize = 256
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const source = audioContextRef.current!.createMediaStreamSource(stream)
          source.connect(analyser!)

          const updateAudioData = () => {
            analyser!.getByteFrequencyData(dataArray)
            setUserAudioData(new Uint8Array(dataArray))
            animationFrameId = requestAnimationFrame(updateAudioData)
          }

          updateAudioData()
        })
        .catch((err) => console.error("Error accessing microphone:", err))
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      setUserAudioData(null)
    }
  }, [isCallActive])

  const processAgentAudio = (audioBuffer: ArrayBuffer) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    audioContext.decodeAudioData(audioBuffer, (buffer) => {
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(analyser)
      analyser.connect(audioContext.destination)
      source.start()

      const updateAgentAudioData = () => {
        analyser.getByteFrequencyData(dataArray)
        setAgentAudioData(new Uint8Array(dataArray))
        if (source.playbackState !== source.FINISHED) {
          requestAnimationFrame(updateAgentAudioData)
        }
      }

      updateAgentAudioData()
    })
  }

  const toggleCall = async () => {
    if (isCallActive) {
      try {
        await conversation.endSession()
        setIsCallActive(false)
        setIsConversationActive(false)
        setAgentAudioData(null)
        setUserAudioData(null)
        if (audioContextRef.current) {
          await audioContextRef.current.close()
          audioContextRef.current = null
        }
        console.log("Call ended successfully")
      } catch (error) {
        console.error("Error ending call:", error)
      }
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        await conversation.startSession({ agentId: config.elevenlabs.agentId })
        setIsCallActive(true)
        setIsConversationActive(true)
        console.log("Call started successfully")
      } catch (error) {
        console.error("Error starting call:", error)
      }
    }
  }

  const handleMessageSent = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: message }] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { value, done } = await reader!.read()
        if (done) break
        const chunk = decoder.decode(value)
        assistantMessage += chunk
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage.role === "assistant") {
            return [...prev.slice(0, -1), { role: "assistant", content: assistantMessage }]
          } else {
            return [...prev, { role: "assistant", content: assistantMessage }]
          }
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "An error occurred. Please try again." }])
    }
  }

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (conversation.status === "connected") {
        conversation.endSession()
      }
    }
  }, [])

  return (
    <Layout>
      <div ref={ref} className="h-screen relative overflow-hidden flex flex-col">
        <div className="flex-grow relative pb-20">
          <ChatDisplay messages={messages} />
          {isCallActive && (
            <div className="fixed inset-0 bg-black z-50">
              <Canvas className="w-full h-full">
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AnimatedSphere agentAudioData={agentAudioData} userAudioData={userAudioData} />
              </Canvas>
            </div>
          )}
        </div>
        <div className="fixed bottom-6 left-4 right-4 z-[9999] flex items-center space-x-2">
          <div className="flex-grow max-w-3xl mx-auto">
            <OpenAIAssistant onMessageSent={handleMessageSent} />
          </div>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center text-black transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              isCallActive
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                : "bg-[#4AFF4A] hover:bg-[#3AEF3A] focus:ring-[#4AFF4A]"
            }`}
            onClick={toggleCall}
          >
            {isCallActive ? <Square size={20} /> : <Phone size={20} />}
          </button>
        </div>
        <Footer />
      </div>
    </Layout>
  )
}

