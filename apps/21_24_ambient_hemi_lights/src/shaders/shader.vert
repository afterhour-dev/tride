
varying vec2 vUvs;

// EXPLAIN: for sending normal
varying vec3 vNormal;

void main(){
  vec4 localPosition=vec4(position,1.);
  
  gl_Position=projectionMatrix*modelViewMatrix*localPosition;
  
  vUvs=uv;
  
  // EXPLAIN: passing it to fragment, but there is a catch
  // a part you need to think about
  // we talk of different spaces the vertices needs to be transformed
  // through in some of the lesson when we start doing shaders
  // You need to decide space you need to do your lighting
  // in. We are going to transform the normal fro local space
  // to world space by using the modelMatrix
  // w is 0.0 because we don't need translation
  // just rotation
  vNormal=(modelMatrix*vec4(normal,0.)).xyz;
  
}