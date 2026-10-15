// EXPLAIN: adding "v" when naming varying, just to differentiate
// it is a preference, and I'll use it
varying vec2 vUvs;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
  
  // EXPLAIN: we are assigning value to the varying
  vUvs=uv;
  
}