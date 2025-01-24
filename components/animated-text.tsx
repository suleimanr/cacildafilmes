import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Vector3, Color } from 'three'

interface AnimatedTextProps {
  char: string
  initialPosition: Vector3
  isInteracting: boolean
  mousePosition: React.RefObject<Vector3>
  spherePosition: Vector3
}

export default function AnimatedText({ char, initialPosition, isInteracting, mousePosition, spherePosition }: AnimatedTextProps) {
  const position = useRef(initialPosition.clone())
  const velocity = useRef(new Vector3())
  const [color, setColor] = useState(new Color())

  useFrame(() => {
    const distanceToMouse = position.current.distanceTo(mousePosition.current)
    const mouseForce = mousePosition.current.clone().sub(position.current).normalize().multiplyScalar(0.02 / (distanceToMouse + 0.1))

    const target = isInteracting ? spherePosition : initialPosition
    const attractionForce = target.clone().sub(position.current).multiplyScalar(0.01)
    
    velocity.current.add(mouseForce)
    velocity.current.add(attractionForce)
    velocity.current.multiplyScalar(0.95)
    position.current.add(velocity.current)

    setColor(new Color().setHSL(1 - Math.min(distanceToMouse / 10, 1), 0.5, 0.5))
  })

  return (
    <Text position={position.current} fontSize={0.2} color={color}>
      {char}
    </Text>
  )
}

