import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// Loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//update all materials
const updateAllMaterials = () =>{
    scene.traverse((child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
        }
    })
}

//environment map
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

//apply env map to background
scene.background = environmentMap
//apply env map to all materials
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(.001).onChange(()=>{
    updateAllMaterials()
})



//Models
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
    gltf.scene.scale.set(10,10,10)
    gltf.scene.position.set(0,-4,0)
    gltf.scene.rotation.y = Math.PI * .75
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(.001).name('rotation')
    updateAllMaterials()
})

//light
const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(.25, 3, -2.25)
scene.add(light)

gui.add(light, 'intensity').min(0).max(10).step(.001).name('lightIntensity')
gui.add(light.position, 'x').min(-5).max(5).step(.001).name('lightX')
gui.add(light.position, 'y').min(-5).max(5).step(.001).name('lightY')
gui.add(light.position, 'z').min(-5).max(5).step(.001).name('lightZ')



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()