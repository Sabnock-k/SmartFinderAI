import './MapBoxComming.css'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Text } from '@react-three/drei'

export default function MapBoxComming() {
  return (
    <Canvas camera={{ position: [5, 5, 8], fov: 25 }} style={{ background: '#A2B9A7' }}>
      <ambientLight intensity={0.4} color="#E5E8E8" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#fff" />
      <FollowMouseCamera />
      <Cube />
      <FloatingTexts />
    </Canvas>
  )
}

function FollowMouseCamera() {
  const { camera, size } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  // Listen to mouse move events
  useState(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / size.width) * 2 - 1
      mouse.current.y = -(event.clientY / size.height) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size])

  useFrame(() => {
    // Target position based on mouse
    const targetX = mouse.current.x * 5
    const targetY = mouse.current.y * 2
    const targetZ = 8
    // Smoothly interpolate camera position
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Cube() {
  const meshRef = useRef()
  const texture = useLoader(TextureLoader, '/assets/map.jpg')
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.007
      meshRef.current.rotation.x += 0.001
    }
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
      <pointLight position={[0, 2, 2]} intensity={0.18} color="#238636" distance={8} />
    </mesh>
  )
}

function FloatingTexts() {
  const time = useRef(0)
  useFrame((state) => {
    time.current = state.clock.getElapsedTime()
  })
  return (
    <>
      <Text
        position={[0, 1.1 + Math.sin(time.current * 1.5) * 0.05, 0]}
        fontSize={0.28}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#161b22"
        outlineWidth={0.008}
        rotation={[0, 0, 0]}
        font={'/assets/oswald-font.ttf'}
      >
        MAP
      </Text>

      <Text
        position={[0, -1.1 + Math.cos(time.current * 1.5) * 0.05, 0]}
        fontSize={0.28}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#161b22"
        outlineWidth={0.008}
        rotation={[0, 0, 0]}
        font={'/assets/oswald-font.ttf'}
      >
        COMMING SOON
      </Text>
    </>
  )
}
