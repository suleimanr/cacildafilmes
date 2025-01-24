import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useConversation } from '@11labs/react'
import { config } from '@/lib/config'
import AgentInfo from './AgentInfo'

interface ChatInterfaceProps {
  isActive: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isActive }) => {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs', new Date().toISOString());
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs', new Date().toISOString());
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error, new Date().toISOString());
      setError(`Error: ${error.message || 'Unknown error'}`);
    },
    onMessage: (message) => {
      console.log('Received message:', message, new Date().toISOString());
      if (message.type === 'transcript' && message.is_final) {
        setMessages(prev => [...prev, { type: 'user', text: message.text }]);
      } else if (message.type === 'response') {
        setMessages(prev => [...prev, { type: 'ai', text: message.text }]);
      }
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleConnection = async () => {
      if (isActive && conversation.status === 'disconnected') {
        try {
          await startConversation();
        } catch (error) {
          console.error('Failed to start conversation:', error);
          // Retry after a delay
          timeoutId = setTimeout(handleConnection, 5000);
        }
      } else if (!isActive && conversation.status === 'connected') {
        await conversation.endSession();
      }
    };

    handleConnection();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
    };
  }, [isActive, conversation.status])

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!config.elevenlabs.agentId) {
        throw new Error('Agent ID is not set. Please check your environment variables.')
      }
      await conversation.startSession({ agentId: config.elevenlabs.agentId })
    } catch (error) {
      console.error('Error starting conversation:', error)
      setError(`Error starting conversation: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error; // Rethrow the error so it can be caught in the useEffect
    }
  }

  return (
    <motion.div
      className="fixed bottom-16 right-4 w-80 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
      initial={{ height: 0 }}
      animate={{ height: isActive ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="mb-4 h-60 overflow-y-auto bg-gray-900 rounded-lg p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.type === 'user' 
                  ? 'bg-blue-500 ml-auto' 
                  : 'bg-gray-700'
              } max-w-[80%] ${
                message.type === 'user' 
                  ? 'ml-auto' 
                  : 'mr-auto'
              }`}
            >
              <p className="text-white text-sm">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex justify-between items-center mb-3 text-sm">
          <p className="text-gray-400">
            Status: <span className="font-semibold text-white">{conversation.status}</span>
          </p>
          <p className="text-gray-400">
            {conversation.isSpeaking ? (
              <span className="font-semibold text-green-400">AI está falando</span>
            ) : (
              <span className="font-semibold text-blue-400">AI está ouvindo</span>
            )}
          </p>
        </div>
        <button
          className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            conversation.status === 'connected'
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          }`}
          onClick={conversation.status === 'connected' ? conversation.endSession : startConversation}
          disabled={conversation.status === 'connecting'}
        >
          {conversation.status === 'connected' ? 'Encerrar Conversa' : 'Iniciar Conversa'}
        </button>
        {error && (
          <p className="mt-3 text-red-400 text-xs text-center bg-red-900 bg-opacity-50 p-2 rounded-lg">
            {error}
          </p>
        )}
        <AgentInfo />
      </div>
    </motion.div>
  )
}

export default ChatInterface

