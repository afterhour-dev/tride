
varying vec2 vUvs;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
  
  //uv is attribute but here we are passing
  // it as varying to use it in frag shader
  vUvs=uv;
  
}