// EXPLAIN: adding varying for UV coordinates
varying vec2 vUvs;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
  
  //EXPLAIN: uv is vec2 attribute but here we are passing
  // it as varying to use it in frag shader
  vUvs=uv;
  
}