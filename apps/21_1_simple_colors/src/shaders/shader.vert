// EXPLAIN: we got this file
// EXPLAIN: reacll that vertex shader only have couple
// responsabilities (which we cover in previous lesson)
// and they are responsible to
//  - produce varying values
//  - output gl_Position

// EXPLAIN: these are provided for us, but if we have to
// declare them we would do something like this
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// attribute vec3 position;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
}