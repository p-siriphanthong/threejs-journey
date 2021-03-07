import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateExerciseModes } from '../../../utils'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/1.png') // posible file numbers are 1-8
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg') // posible file numbers are 3 and 5

const environmentMapNumber = 0 // position numbers are 0-3
const environmentMapTexture = cubeTextureLoader.load([
  `/textures/environmentMaps/${environmentMapNumber}/px.jpg`,
  `/textures/environmentMaps/${environmentMapNumber}/nx.jpg`,
  `/textures/environmentMaps/${environmentMapNumber}/py.jpg`,
  `/textures/environmentMaps/${environmentMapNumber}/ny.jpg`,
  `/textures/environmentMaps/${environmentMapNumber}/pz.jpg`,
  `/textures/environmentMaps/${environmentMapNumber}/nz.jpg`,
])

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

// Exercise modes
let material, gui, sphere, plane, torus
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
    {
      name: 'MeshToonMaterial',
      handler: () => {
        material = new THREE.MeshToonMaterial()
      },
    },
    {
      name: 'MeshToonMaterial (gradientMap)',
      handler: () => {
        material = new THREE.MeshToonMaterial()
        material.gradientMap = gradientTexture
        gradientTexture.minFilter = THREE.NearestFilter
        gradientTexture.magFilter = THREE.NearestFilter
        gradientTexture.generateMipmaps = false
      },
    },
    {
      name: 'MeshStandardMaterial',
      handler: () => {
        material = new THREE.MeshStandardMaterial()
      },
    },
    {
      name: 'MeshStandardMaterial (metalness & roughness)',
      handler: () => {
        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.metalness = 0.45
        material.roughness = 0.65

        gui.add(material, 'metalness').min(0).max(1).step(0.0001)
        gui.add(material, 'roughness').min(0).max(1).step(0.0001)
      },
    },
    {
      name: 'MeshStandardMaterial (aoMap)',
      handler: () => {
        sphere.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )
        plane.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        torus.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.aoMap = doorAmbientOcclusionTexture
        material.aoMapIntensity = 1

        gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
      },
    },
    {
      name: 'MeshStandardMaterial (displacementMap)',
      handler: () => {
        sphere.geometry = new THREE.SphereGeometry(0.5, 64, 64)
        plane.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
        torus.geometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)

        sphere.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )
        plane.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        torus.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.aoMap = doorAmbientOcclusionTexture
        material.aoMapIntensity = 1
        material.displacementMap = doorHeightTexture
        material.displacementScale = 0.05

        gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
        gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
      },
    },
    {
      name: 'MeshStandardMaterial (metalnessMap & roughnessMap)',
      handler: () => {
        sphere.geometry = new THREE.SphereGeometry(0.5, 64, 64)
        plane.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
        torus.geometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)

        sphere.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )
        plane.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        torus.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.aoMap = doorAmbientOcclusionTexture
        material.aoMapIntensity = 1
        material.displacementMap = doorHeightTexture
        material.displacementScale = 0.05
        material.metalnessMap = doorMetalnessTexture
        material.roughnessMap = doorRoughnessTexture
        material.metalness = 0
        material.roughness = 1

        gui.add(material, 'metalness').min(0).max(1).step(0.0001)
        gui.add(material, 'roughness').min(0).max(1).step(0.0001)
      },
    },
    {
      name: 'MeshStandardMaterial (normalMap)',
      handler: () => {
        sphere.geometry = new THREE.SphereGeometry(0.5, 64, 64)
        plane.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
        torus.geometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)

        sphere.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )
        plane.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        torus.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.aoMap = doorAmbientOcclusionTexture
        material.aoMapIntensity = 1
        material.displacementMap = doorHeightTexture
        material.displacementScale = 0.05
        material.metalnessMap = doorMetalnessTexture
        material.roughnessMap = doorRoughnessTexture
        material.metalness = 0
        material.roughness = 1
        material.normalMap = doorNormalTexture
        material.normalScale.set(0.5, 0.5)

        gui.add(material.normalScale, 'x').min(0).max(1).step(0.0001)
        gui.add(material.normalScale, 'y').min(0).max(1).step(0.0001)
      },
    },
    {
      name: 'MeshStandardMaterial (alphaMap)',
      handler: () => {
        sphere.geometry = new THREE.SphereGeometry(0.5, 64, 64)
        plane.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
        torus.geometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128)

        sphere.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )
        plane.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        torus.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        material = new THREE.MeshStandardMaterial()
        material.map = doorColorTexture
        material.aoMap = doorAmbientOcclusionTexture
        material.aoMapIntensity = 1
        material.displacementMap = doorHeightTexture
        material.displacementScale = 0.05
        material.metalnessMap = doorMetalnessTexture
        material.roughnessMap = doorRoughnessTexture
        material.metalness = 0
        material.roughness = 1
        material.normalMap = doorNormalTexture
        material.normalScale.set(0.5, 0.5)
        material.transparent = true
        material.alphaMap = doorAlphaTexture
      },
    },
    {
      name: 'Environment map',
      handler: () => {
        material = new THREE.MeshStandardMaterial()
        material.metalness = 0.7
        material.roughness = 0.2
        material.envMap = environmentMapTexture

        gui.add(material, 'metalness').min(0).max(1).step(0.0001)
        gui.add(material, 'roughness').min(0).max(1).step(0.0001)
      },
    },
  ],
  {
    before: () => {
      /**
       * Debug
       */
      gui?.destroy()
      gui = new dat.GUI()

      /**
       * Objects
       */
      if (sphere) scene.remove(sphere)
      if (plane) scene.remove(plane)
      if (torus) scene.remove(torus)

      sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16))
      sphere.position.x = -1.5

      plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1))

      torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32))
      torus.position.x = 1.5
    },
    after: () => {
      sphere.material = material
      plane.material = material
      torus.material = material

      scene.add(sphere, plane, torus)
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
