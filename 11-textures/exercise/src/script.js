import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateExerciseModes } from '../../../utils'

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Transforming Textures
 */
// Repeat
const repeatTexture = textureLoader.load('/textures/door/color.jpg')
repeatTexture.repeat.x = 2
repeatTexture.repeat.y = 3
repeatTexture.wrapS = THREE.RepeatWrapping // is for the `x` axis
repeatTexture.wrapT = THREE.RepeatWrapping // is for the `y` axis

// Mirrored Repeat
const mirroredRepeatTexture = textureLoader.load('/textures/door/color.jpg')
mirroredRepeatTexture.repeat.x = 2
mirroredRepeatTexture.repeat.y = 3
mirroredRepeatTexture.wrapS = THREE.MirroredRepeatWrapping // is for the `x` axis
mirroredRepeatTexture.wrapT = THREE.MirroredRepeatWrapping // is for the `y` axis

// Offset
const offsetTexture = textureLoader.load('/textures/door/color.jpg')
offsetTexture.repeat.x = 2
offsetTexture.repeat.y = 3
offsetTexture.wrapS = THREE.MirroredRepeatWrapping // is for the `x` axis
offsetTexture.wrapT = THREE.MirroredRepeatWrapping // is for the `y` axis
offsetTexture.offset.x = 0.5
offsetTexture.offset.y = 0.5

// Rotation
const rotationTexture = textureLoader.load('/textures/door/color.jpg')
rotationTexture.rotation = Math.PI * 0.25
rotationTexture.center.x = 0.5
rotationTexture.center.y = 0.5

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Exercise modes
let texture = null
generateExerciseModes(
  [
    {
      name: 'Color Texture',
      handler: () => {
        texture = colorTexture
      },
    },
    {
      name: 'Alpha Texture',
      handler: () => {
        texture = alphaTexture
      },
    },
    {
      name: 'Height Texture',
      handler: () => {
        texture = heightTexture
      },
    },
    {
      name: 'Normal Texture',
      handler: () => {
        texture = normalTexture
      },
    },
    {
      name: 'Ambient Occlusion Texture',
      handler: () => {
        texture = ambientOcclusionTexture
      },
    },
    {
      name: 'Metalness Texture',
      handler: () => {
        texture = metalnessTexture
      },
    },
    {
      name: 'Roughness Texture',
      handler: () => {
        texture = roughnessTexture
      },
    },
    {
      name: 'Repeat Texture',
      handler: () => {
        texture = repeatTexture
      },
    },
    {
      name: 'Mirrored Repeat Texture',
      handler: () => {
        texture = mirroredRepeatTexture
      },
    },
    {
      name: 'Offset Texture',
      handler: () => {
        texture = offsetTexture
      },
    },
    {
      name: 'Rotation Texture',
      handler: () => {
        texture = rotationTexture
      },
    },
  ],
  {
    before: () => {
      scene.clear()
    },
    after: () => {
      /**
       * Object
       */
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ map: texture })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    },
  }
)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
