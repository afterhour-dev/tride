// EXPLAIN: we got this file
// EXPLAIN: reacll that vertex shader only have couple
// responsabilities (which we cover in previous lesson)
// and they are responsible to
//  - produce varying values
//  - output gl_Position

// EXPLAIN: these are provided for us by threejs, but if we have to
// declare them we would do something like this
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// EXPLAIN: from where is position comming from
// it is also applied by threejs
// attribute vec3 position;
// EXPLAIN: are all of these mentioned projectionMatrix, modelViewMatrix,
// and position added by threejs when it takes our code
// to execute it?

void main(){
  vec4 localPosition=vec4(position,1.);
  
  // EXPLAIN: we are outputing to gl_Position
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
}