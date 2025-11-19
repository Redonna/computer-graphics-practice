import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Loaders
const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

// Load textures
const colorMap      = texLoader.load('textures/velour_velvet_diff_4k.jpg');
const displacementMap = texLoader.load('textures/velour_velvet_disp_4k.png');
const specMap       = texLoader.load('textures/velour_velvet_spec_ior_4k.png');
const anisotropyRot = texLoader.load('textures/velour_velvet_anisotropy_rotation_4k.png');
const anisotropyStr = texLoader.load('textures/velour_velvet_anisotropy_strength_4k.png');

const roughnessMap  = exrLoader.load('textures/velour_velvet_rough_4k.exr');
const metalnessMap  = exrLoader.load('textures/velour_velvet_metal_4k.exr');
const normalMap     = exrLoader.load('textures/velour_velvet_nor_gl_4k.exr');

// Enable repeating if needed
[
    colorMap,
    roughnessMap,
    metalnessMap,
    normalMap,
    displacementMap
].forEach(tex => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
});

// Sphere Geometry
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 128, 128),
    new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        metalnessMap: metalnessMap,
        displacementMap: displacementMap,
        displacementScale: 0.05,
        specularIntensityMap: specMap,
        sheen: 1.0,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color(0xffffff),
    })
);

scene.add(sphere);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(3, 3, 3);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
