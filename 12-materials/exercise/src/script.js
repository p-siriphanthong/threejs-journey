import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateExerciseModes } from '../../../utils'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16))
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1))

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32))
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Exercise modes
let material = null
generateExerciseModes(
  [
    {
      name: 'MeshBasicMaterial (map)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.map = doorColorTexture
      },
    },
    {
      name: 'MeshBasicMaterial (color)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.color = new THREE.Color('#ff0000')
      },
    },
    {
      name: 'MeshBasicMaterial (map & color)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.map = doorColorTexture
        material.color = new THREE.Color('#ff0000')
      },
    },
    {
      name: 'MeshBasicMaterial (wireframe)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.wireframe = true
      },
    },
    {
      name: 'MeshBasicMaterial (opacity)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.transparent = true
        material.opacity = 0.5
      },
    },
    {
      name: 'MeshBasicMaterial (alphaMap)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.transparent = true
        material.alphaMap = doorAlphaTexture
      },
    },
    {
      name: 'MeshBasicMaterial (side)',
      handler: () => {
        material = new THREE.MeshBasicMaterial()
        material.side = THREE.DoubleSide
      },
    },
    {
      name: 'MeshNormalMaterial',
      handler: () => {
        material = new THREE.MeshNormalMaterial()
      },
    },
    {
      name: 'MeshNormalMaterial (wireframe)',
      handler: () => {
        material = new THREE.MeshNormalMaterial()
        material.wireframe = true
      },
    },
    {
      name: 'MeshNormalMaterial (flatShading)',
      handler: () => {
        material = new THREE.MeshNormalMaterial()
        material.flatShading = true
      },
    },
    {
      name: 'MeshMatcapMaterial',
      handler: () => {
        material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture
      },
    },
    {
      name: 'MeshDepthMaterial',
      handler: () => {
        material = new THREE.MeshDepthMaterial()
      },
    },
    {
      name: 'MeshLambertMaterial',
      handler: () => {
        material = new THREE.MeshLambertMaterial()
      },
    },
    {
      name: 'MeshPhongMaterial',
      handler: () => {
        material = new THREE.MeshPhongMaterial()
      },
    },
    {
      name: 'MeshPhongMaterial (shininess & specular)',
      handler: () => {
        material = new THREE.MeshPhongMaterial()
        material.shininess = 100
        material.specular = new THREE.Color(0x1188ff)
      },
    },
  ],
  {
    after: () => {
      sphere.material = material
      plane.material = material
      torus.material = material
    },
  }
)

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
camera.position.z = 2
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  plane.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
