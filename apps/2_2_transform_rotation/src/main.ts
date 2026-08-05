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

	// ------ Transformations - rotation ----------------------

	// EXPLAIN: what is rotation, also is it a Vector3 or Euler or something else?
	// two ways of rotation
	//     - euler:          radians = degrees * Math.PI / 180
	// 												(problematic because of gimbal lock)
	// 		 - quaternion      never used it
	// 												(but eliminates
	// 												posibility of gimbal lock from what I heard)

	// EXPLAIN: this equation radians = degrees * Math.PI / 180

	// EXPLAIN: list some basic values in radians
	// 				like equivalents for 5, 15, 30, 45, 60, 90, 120, 180, 360

	// rotating   45   deg by y
	mesh.rotation.y = (45 * Math.PI) / 180;

	// EXPLAIN: rotating y by 90 will create gimbal lock for
	// x and z, they will have same rotation
	// 45 + 45 = 90
	mesh.rotation.y += (45 * Math.PI) / 180;
	// now we have mentioned gimbal lock for x and z

	// EXPLAIN: gimbal lock (loosing a degree of freedom)

	// EXPLAIN: how reordering fixes gimbal lock
	mesh.rotation.reorder('YXZ');

	// EXPLAIN: are there any methods of rotation that are
	// used offten and are useful

	// TODO: learn quaternion. I will learn it when I get to
	// do animation in some next lessons, but not this one

	// TODO: I will write docs for gimbal lock interactivly
	// when I adopt using gui and when I get to animation

	//

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
