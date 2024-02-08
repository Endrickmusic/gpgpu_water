import { useRef } from 'react'
import { Canvas, useLoader  } from '@react-three/fiber'
import { OrbitControls, useHelper, useTexture, useEnvironment, Environment } from '@react-three/drei'
import { DoubleSide, DirectionalLightHelper } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'

import './index.css'
import Shader from './Shader.jsx'

function Scene() {

  const BOUNDS = 512
  const WIDTH = 128

  const light1Ref = useRef()
  const light2Ref = useRef()
  const planeRef = useRef()

  useHelper(light1Ref, DirectionalLightHelper, 150, "red")
  useHelper(light2Ref, DirectionalLightHelper, 150, "blue")
  // useHelper(planeRef, VertexNormalsHelper, 1, "green");

  const [displaceMap1, displaceMap2, displaceMap3] = useTexture(['./textures/heightmap_01.png', './textures/heightmap_02.jpg', './textures/heightmap_03.png'])

  const props = useTexture({
    RoughnessMap: './textures/rock_textures/aerial_rocks_01_rough_4k.jpg',
    map: './textures/rock_textures/aerial_rocks_01_diff_4k.jpg',
    displacementMap: './textures/rock_textures/aerial_rocks_01_disp_4k.png'
    // normalMap: './textures/rock_textures/aerial_rocks_01_nor_gl_4k.exr'
  })

  const normalMap = useLoader(EXRLoader, './textures/rock_textures/aerial_rocks_01_nor_gl_4k.exr') 


return(
  <>
  <Environment files='./environment/envmap.hdr'/>
  <directionalLight
      ref={light1Ref}
      position = {[300, 200, 175]}
      castShadow
      intensity = {2}
      />
      <directionalLight
      ref={light2Ref}
      position = {[ -100, 150, -200 ]}
      castShadow
      intensity = {1.5}
      />

  <mesh
    ref={planeRef}
    rotation={[- Math.PI / 2, 0, 0]}
    receiveShadow
      >
      <planeGeometry
      args={[BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1]}
      
      />
      <meshStandardMaterial 
      {...props}
      side={DoubleSide}
      wireframe={false}
      // displacementMap={displaceMap1}
      displacementScale={50}
      roughness={0.4}
      metalness={1.0}
      normalMap={normalMap}
      normalScale={50}
      />
      </mesh>
      </>
)}

function App() {

  return (
  <>

    <Canvas
    shadows
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
