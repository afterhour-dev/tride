// EXPLAIN: since I'll be writing TSL for the first time
// I need these, and I want to do it separate file because somehow makes
// me uncconfortable having shader related code together with
// rest of the typescript code. Feels hard to read
import {
	positionLocal,
	vec3,
	vec4,
	uv,
	positionGeometry,
} from 'three/tsl';

// EXPLAIN: writing vertex shader with TSL

// EXPLAIN: we won't just export positionLocal
// export const positionNode = positionLocal;
// because we want to eliminate all matrix transformations:
// `gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`
// we just want `gl_Position = vec4(position, 1.0);`
// because we want for plain to always is in front of camera

// EXPLAIN: so instead just setting positionLocal on material.positionNode
// we will set it up on vertexNode
//
export const vertexNode = vec4(positionGeometry, 1.0);

// EXPLAIN: writing fragment shader with TSL
export const colorNode = vec3(uv().yx, uv().y);

// EXPALIN: will expoer them and use them in main.ts
