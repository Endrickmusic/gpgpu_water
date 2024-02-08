import { useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useHelper, useTexture, useEnvironment, Environment } from '@react-three/drei'
import { DoubleSide, DirectionalLightHelper, Vector2 } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'

import './index.css'

function Scene() {

  const { gl } = useThree()

  const BOUNDS = 512
  const WIDTH = 128
  const HEIGHT = WIDTH


  const light1Ref = useRef()
  const light2Ref = useRef()
  const planeRef = useRef()

  let computeMaterial

  useHelper(light1Ref, DirectionalLightHelper, 150, "red")
  useHelper(light2Ref, DirectionalLightHelper, 150, "blue")
  // useHelper(planeRef, VertexNormalsHelper, 1, "green");

  const [displaceMap1, displaceMap2, displaceMap3] = useTexture(['./textures/heightmap_01.png', './textures/heightmap_02.jpg', './textures/heightmap_03.png'])

  const props = useTexture({
    // RoughnessMap: './textures/rock_textures/aerial_rocks_01_rough_4k.jpg',
    // map: './textures/rock_textures/aerial_rocks_01_diff_4k.jpg',
    // displacementMap: './textures/rock_textures/aerial_rocks_01_disp_4k.png'
    // normalMap: './textures/rock_textures/aerial_rocks_01_nor_gl_4k.exr'
  })

  // const normalMap = useLoader(EXRLoader, './textures/rock_textures/aerial_rocks_01_nor_gl_4k.exr') 

  // GPUComputationRenderer instance
  const gpuCompute = useRef(null);
  const displacementMap = useRef(null);

  useEffect(() => {
    gpuCompute.current = new GPUComputationRenderer(WIDTH, HEIGHT, gl)
    gpuCompute.current = gpuRenderer;
    computeMaterial = initComputeRenderer()
    initComputeRenderer()
    console.log('Effect is rendered')
  }, [])

  // Create a displacement map texture
  useFrame(() => {
    console.log('Frame is rendered')
    if (gpuCompute.current && gpuCompute.current.getCurrentRenderTarget(displacementMap.current) !== null) {
      const texture = gpuCompute.current.getCurrentRenderTarget(displacementMap.current).texture;
      if (texture) {
        texture.needsUpdate = true;
      }
    }
  })

  
  // Initialize the compute shader
  const initComputeRenderer = () => {
    const computeMaterial = gpuCompute.current.createShaderMaterial(
      `
      uniform vec2 resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float height = sin(uv) // Your heightmap generation algorithm or noise function here;
        gl_FragColor = vec4(height, height, height, 1.0);
      }
      `,
      { resolution: { value: new Vector2(WIDTH, HEIGHT) } }
    )
    return computeMaterial
  }
   
  const heightmapVariable = gpuCompute.current.addVariable('heightmap', computeMaterial)

  gpuCompute.current.setVariableDependencies(heightmapVariable, [heightmapVariable])
  
  heightmapVariable.material.uniforms.resolution = { value: new Vector2(WIDTH, HEIGHT) }

    const error = gpuCompute.current.init()
    if (error !== null) {
      console.error(error);
    }

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
      // map={normalMap}
      side={DoubleSide}
      wireframe={false}
      // displacementMap={displacementMap.current}
      displacementScale={50}
      roughness={0.8}
      metalness={0.0}
      // normalMap={normalMap}
      // normalScale={50}
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
