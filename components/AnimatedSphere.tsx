import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import { Vector3, type MeshPhongMaterial } from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"

interface AnimatedSphereProps {
  agentAudioData: Uint8Array | null
  userAudioData: Uint8Array | null
}

export default function AnimatedSphere({ agentAudioData, userAudioData }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const noise = useRef(new SimplexNoise())

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      const positions = meshRef.current.geometry.attributes.position

      for (let i = 0; i < positions.count; i++) {
        const p = new Vector3().fromBufferAttribute(positions, i)
        p.normalize()

        let displacement = 0

        if (agentAudioData || userAudioData) {
          const agentDisplacement = agentAudioData ? (agentAudioData[i % agentAudioData.length] / 255) * 1.0 : 0
          const userDisplacement = userAudioData ? (userAudioData[i % userAudioData.length] / 255) * 1.0 : 0
          displacement = Math.max(agentDisplacement, userDisplacement)
        } else {
          // When there's no audio data, use noise for a subtle animation
          displacement =
            0.1 * noise.current.noise3d(p.x * 1.5 + time * 0.5, p.y * 1.5 + time * 0.5, p.z * 1.5 + time * 0.5)
        }

        p.multiplyScalar(2 + displacement)
        positions.setXYZ(i, p.x, p.y, p.z)
      }

      positions.needsUpdate = true

      const material = meshRef.current.material as MeshPhongMaterial
      material.color.setHSL(0.33, 0.5, 0.5) // Verde
      material.emissive.setHSL(0.33, 0.5, 0.5) // Verde
    }
  })

  return (
    <Sphere args={[2, 64, 64]} ref={meshRef}>
      <meshPhongMaterial wireframe />
    </Sphere>
  )
}

