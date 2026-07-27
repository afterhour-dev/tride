import './style.css';
import * as THREE from 'three/webgpu';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: 800,
	height: 600,
};

async function init() {
	const scene = new THREE.Scene();

	const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		wireframe: true,
	});

	const mesh = new THREE.Mesh(boxGeometry, material);
	mesh.position.z = 1.5;
	mesh.position.x = -0.5;
	mesh.position.y = 0.6;

	// ------ Transformations - scale ----------------------
	// EXPLAIN: what is scale, also is it a Vector3 or Euler or something else?
	// EXPLAIN: what methods are used and how
	mesh.scale.setScalar(0.5);
	mesh.scale.set(2, 1.5); // can omit z if you want
	mesh.scale.z = 1.2;
	// --------------------------------------------------------

	scene.add(mesh);

	// 3 - Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
	);
	camera.position.z = 3;
	// I wanted view to be more like 3d
	// since before z axe was going normal to our camera lense
	// made axe helper invisible and made our object to apea 2D
	camera.position.y = 0.5;
	camera.position.x = 0.1;

	scene.add(camera);

	// 4 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	// 5 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);
}

await init();
