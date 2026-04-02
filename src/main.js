import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. Grab the UI text to report status
const uiText = document.querySelector('#ui p');
uiText.innerText = "Engine Started. Building scene...";

// 2. Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 3. Setup Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);

// 4. THE DIAGNOSTIC CUBE
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Bright Red
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

uiText.innerText = "If you see a red box, the 3D engine works perfectly.";

// 5. Try to load the brain
const loader = new GLTFLoader();
loader.load(
  '/brain_model.glb', 
  (gltf) => {
    const model = gltf.scene;
    // We scale it up just in case it's tiny
    model.scale.set(5, 5, 5); 
    scene.add(model);
    uiText.innerText = "SUCCESS! Brain Loaded. (It might be overlapping the cube).";
  },
  undefined,
  (error) => {
    console.error(error);
    uiText.innerText = "FAILED: The engine works, but the .glb file is broken or missing.";
  }
);

// 6. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();