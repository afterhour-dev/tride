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
		// wireframe: true,
	});

	// ------ Transformations - group ----------------------

	const group = new THREE.Group();
	// const group2 = new THREE.Group();

	scene.add(group);

	const meshOne = new THREE.Mesh(boxGeometry, material);
	const meshTwo = new THREE.Mesh(
		new THREE.BoxGeometry(0.5, 0.5, 0.5),
		new THREE.MeshBasicMaterial({
			color: 0x433024,
		}),
	);
	const meshThree = new THREE.Mesh(
		boxGeometry,
		new THREE.MeshBasicMaterial({
			color: '#853a34',
		}),
	);

	group.add(meshOne, meshTwo);
	// group2.add(meshOne, meshTwo, meshThree);

	meshOne.position.x = -1.5;
	meshThree.position.x = 1.5;

	group.rotation.x = (45 * Math.PI) / 180;
	group.scale.set(0.5, 0.5);
	group.position.y = 0.5;
	group.position.x = -0.5;

	scene.add(meshThree);

	// --------------------------------------------------------

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
