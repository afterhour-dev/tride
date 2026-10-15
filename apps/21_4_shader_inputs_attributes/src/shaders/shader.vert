// EXPLAIN: adding an attribute
// this isn't given to you by threejs, to mke it obvious I
// defined this name
attribute vec3 radeDevColor;
// EXPLAIN: we will then in main.ts create a array of colors

// EXPLAIN: to pass the attribute to the fragment shader we must
// pack it to varying
varying vec3 vRadeDevColor;

varying vec2 vUvs;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
  
  // uv is attribute but here we are passing it as varying
  // to frag shader
  vUvs=uv;
  
  // EXPLAIN: passing the vaeying og my color to the
  // fragment shader
  vRadeDevColor=radeDevColor;
  
}