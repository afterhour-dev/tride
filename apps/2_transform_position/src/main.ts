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

	// ------ Transformations - position ----------------------

	mesh.position.x = 0.7;
	mesh.position.z = -1;
	mesh.position.y = 1;

	// EXPLAIN: what is Object3D, and what instances in our code
	// are also instances of Object3D

	// EXPLAIN: what is position
	console.log(mesh.position);

	// EXPLAIN: mesh also inherits from Vector3 constructor
	// what is Vector3
	console.log(mesh.position instanceof THREE.Vector3);

	// EXPLAIN: useful methods of Vector3, the ones I encounter are
	// length, distanceTo, normalize, setX, setY, setZ

	// distance from Vector3 to the center of the scene
	console.log(mesh.position.length());

	// distance from the Vector3 to the other Vector3
	// convinient
	console.log(mesh.position.distanceTo(new THREE.Vector3(5, 5, 5)));

	// set vector to be far from center by only value of 1
	// proportions of previous movement will be preserved
	// imagine line that goes from vector3 to the centar of the sene
	// well, the vector3 will be moved across that line to be
	// far from center only by 1
	mesh.position.normalize();

	// now this should be 1
	console.log(mesh.position.length());

	// TODO: show some other additional methods
	// only if they are offten used and are really useful

	// GOTCHA: important is that this is not stateful which means
	// you are not adding or removing from previous values
	// you just assigned new values
	mesh.position.x = 0.8;
	mesh.position.z = 0.5;
	mesh.position.y = -0.2;

	// NOTE: we can use setX/Y/Z method to set individual ones
	// EXPLAIN: how is this different than using = assignment
	// and when is it useful
	mesh.position.setX(0.6);

	// NOTE: we can set all at once using set method
	// NOTE: we don't need to set all three values, minimum is setting x and y
	// NOTE: you can't set only x with it
	// EXPLAIN: where and when it is useful
	mesh.position.set(1, 1);

	mesh.position.set(0.9, -0.3, 1.2);

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
