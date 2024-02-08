import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useHelper, useTexture } from '@react-three/drei'
import { DoubleSide, DirectionalLightHelper } from 'three'

import './index.css'
import Shader from './Shader.jsx'

function Scene() {

  const BOUNDS = 512
  const WIDTH = 128

  const light1Ref = useRef()
  const light2Ref = useRef()

  useHelper(light1Ref, DirectionalLightHelper, 150, "red")
  useHelper(light2Ref, DirectionalLightHelper, 150, "blue")

  const [displaceMap1, displaceMap2, displaceMap3] = useTexture(['./textures/heightmap_01.png', './textures/heightmap_02.jpg', './textures/heightmap_03.png'])

return(
  <>
  <directionalLight
      ref={light1Ref}
      position = {[300, 400, 175]}
      />
      <directionalLight
      ref={light2Ref}
      position = {[ -100, 350, -200 ]}
      />

  <mesh
    rotation={[- Math.PI / 2, 0, 0]}
      >
      <planeGeometry
      args={[BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1]}
      
      />
      <meshStandardMaterial 
      side={DoubleSide}
      wireframe={true}
      displacementMap={displaceMap1}
      displacementScale={50}
      />
      </mesh>
      </>
)}

function App() {

  return (
  <>

    <Canvas
      camera={{ 
      position: [0, 150, 450],
      near: 0.01,
      far: 2000,
      fov: 40 }}  
    >
      <color attach="background" args={[0x999999]} />

      <OrbitControls />

      

    <Scene/ >
    </Canvas>
  </>
  )
}

export default App
