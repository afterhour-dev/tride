// import './style.css';
import * as THREE from 'three';

// 1 - Canvas element
const canvas: HTMLCanvasElement | null =
	document.querySelector('canvas#tride');

if (!canvas) throw new Error('Canvas element is missing!');

const sizes = {
	width: 800,
	height: 600,
};

// 2 - Scene
const scene = new THREE.Scene();

// 3 - Geometry and Material
// const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: 0x4c9892,
	// color: "orange",
	// wireframe: true,
});

// 4 - Mesh
// const mesh = new THREE.Mesh(sphereGeometry, material);
const mesh = new THREE.Mesh(boxGeometry, material);
scene.add(mesh);

// 5 - Camera
const camera = new THREE.PerspectiveCamera(
	// in real world example we would put something smaller here like 35
	75,
	sizes.width / sizes.height,
);
camera.position.z = 3;
camera.position.x = 0.5;
scene.add(camera);

// 6 - Renderer
const renderer = new THREE.WebGLRenderer({
	canvas,
});

// 8 - Axes Helper
const axesHelper = new THREE.AxesHelper(5);
axesHelper.setColors('red', 'green', 'blue');
scene.add(axesHelper);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
