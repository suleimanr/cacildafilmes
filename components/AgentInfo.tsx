import React, { useEffect, useState } from 'react'
import { config } from '@/lib/config'

const AgentInfo: React.FC = () => {
  const [agentName, setAgentName] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${config.elevenlabs.agentId}`, {
          headers: {
            'xi-api-key': config.elevenlabs.apiKey || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAgentName(data.name)
        } else {
          console.error('Failed to fetch agent info')
        }
      } catch (error) {
        console.error('Error fetching agent info:', error)
      }
    }

    if (config.elevenlabs.agentId) {
      fetchAgentInfo()
    }
  }, [])

  return (
    <div className="text-sm text-gray-500 mt-2">
      {agentName ? `Agent: ${agentName}` : 'Loading agent info...'}
    </div>
  )
}

export default AgentInfo

