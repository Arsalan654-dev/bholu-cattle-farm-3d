import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import { useSettings } from '../context/SettingsContext.jsx'

function Droplets({ quality }) {
  const drops = [
    [-1.1, -1.55, 0.4, 0.19],
    [1.15, -1.7, -0.3, 0.24],
    [-0.2, 1.75, -0.1, 0.14],
    [1.6, -0.7, 0.6, 0.12],
    [-1.7, -0.2, 0.3, 0.1],
  ]
  return (
    <group>
      {drops.map(([x, y, z, r], i) => (
        <Float key={i} speed={1.6} rotationIntensity={0.2} floatIntensity={1.6}>
          <mesh position={[x, y, z]}>
            <sphereGeometry args={[r, 32, 32]} />
            {quality.transmission ? (
              <meshPhysicalMaterial
                transmission={1}
                thickness={0.35}
                roughness={0.06}
                ior={1.5}
                color="#ffffff"
                envMapIntensity={1.4}
                clearcoat={0.6}
              />
            ) : (
              <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.05} envMapIntensity={1.3} />
            )}
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Orb({ quality, intro, onReady }) {
  const group = useRef()
  const mat = useRef()
  const { pointer, camera } = useThree()
  const cam = useRef({ z: 7.8, y: 0.5, x: 0 })

  useEffect(() => {
    onReady?.({ group: group.current, mat: mat.current, cam: cam.current, intro })
  }, [onReady, intro])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return
    g.rotation.y += (Math.sin(t * 0.22) * 0.16 + state.pointer.x * 0.5 - g.rotation.y) * 0.02
    g.rotation.x = Math.sin(t * 0.17) * 0.1 - state.pointer.y * 0.24
    const breathe = 1 + Math.sin(t * 0.5) * 0.014
    g.scale.setScalar(breathe * intro.current.value)
    if (mat.current) {
      mat.current.distort = 0.2 + Math.sin(t * 0.62) * 0.04 + Math.sin(t * 1.13) * 0.018
    }
    camera.position.x += (cam.current.x - camera.position.x) * 0.05
    camera.position.y += (cam.current.y - camera.position.y) * 0.05
    camera.position.z += (cam.current.z - camera.position.z) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={group} position={[0.55, 0.05, 0]} scale={0.8}>
      <mesh>
        <sphereGeometry args={[1.65, quality.segments, quality.segments]} />
        <MeshDistortMaterial
          ref={mat}
          distort={0.2}
          speed={0}
          color="#f6f1ea"
          roughness={0.055}
          metalness={0}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
          sheen={1}
          sheenColor="#ffffff"
          sheenRoughness={0.35}
          envMapIntensity={1.25}
        />
      </mesh>
      <Droplets quality={quality} />
    </group>
  )
}

function Atmosphere({ quality }) {
  const gridRef = useRef()
  useEffect(() => {
    if (gridRef.current?.material) {
      gridRef.current.material.transparent = true
      gridRef.current.material.opacity = 0.4
    }
  }, [])
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[3.2, 4.1, 2.4]} intensity={1.35} color="#ffffff" />
      <pointLight position={[-2.6, 1.1, -1.6]} intensity={0.9} decay={0} color="#ff2a1d" />
      <pointLight position={[2.6, -1.3, -1.2]} intensity={0.7} decay={0} color="#7d9160" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 6, -2]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[8, 2.6, 1]} color="#ffd9d2" />
        <Lightformer form="rect" intensity={1.6} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2.2, 1]} color="#e4ecd9" />
      </Environment>
      <ContactShadows position={[0, -2.35, 0]} opacity={0.6} scale={13} blur={2.7} far={5.5} color="#000000" />
      <gridHelper ref={gridRef} args={[30, 46, '#4d463d', '#221c18']} position={[0, -2.35, -1.4]} />
      {quality.particles > 0 && (
        <Sparkles count={quality.particles} scale={[11, 6.5, 5]} size={2.6} speed={0.32} opacity={0.5} color="#ffffff" />
      )}
      {quality.particles > 0 && (
        <Sparkles count={Math.floor(quality.particles * 0.3)} scale={[9, 5, 4]} size={1.6} speed={0.24} opacity={0.35} color="#a9c08a" />
      )}
      <fog attach="fog" args={['#0a0808', 7.5, 26]} />
    </>
  )
}

export default function MilkOrb({ variant = 'hero', fallbackClass = 'hero__orb', onReady }) {
  const { quality, reduced, webgl } = useSettings()
  const holderRef = useRef(null)
  const [active, setActive] = useState(true)
  const intro = useRef({ value: reduced ? 1 : 0.74, done: false })

  useEffect(() => {
    if (!holderRef.current) return undefined
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '60% 0px' })
    io.observe(holderRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={holderRef} className="orb-holder">
      <div className={variant === 'cta' ? 'orb-cta' : fallbackClass} aria-hidden="true" />
      {!reduced && webgl && (
        <Suspense fallback={null}>
          <div className="orb3d" data-cursor="milk">
            <Canvas
              dpr={[1, quality.dpr]}
              frameloop={active ? 'always' : 'never'}
              gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
              camera={{ fov: 35, position: [0, 0.55, 8.6] }}
              onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
              style={{ width: '100%', height: '100%' }}
            >
              <Orb quality={quality} intro={intro} onReady={onReady} />
              <Atmosphere quality={quality} />
            </Canvas>
          </div>
        </Suspense>
      )}
    </div>
  )
}
