
varying vec2 vUvs;

float inverseLerp(float v,float minVal,float maxVal){
  return(v-minVal)/(maxVal-minVal);
}

float remap(
  float v,
  float inMin,
  float inMax,
  float outMin,
  float outMax
){
  float t=inverseLerp(v,inMin,inMax);
  return mix(outMin,outMax,t);
}

void main(){
  
  // EXPLAIN: declaring two vec3, one for color, other
  // for lighting
  vec3 baseColor=vec3(.5);
  vec3 lighting=vec3(0.);
  
  // EXPLAIN: adding ambient light
  vec3 ambient=vec3(.5);
  
  // EXPLAIN: and then lighting is sum of all lighting
  // sources
  lighting+=ambient;
  
  // EXPLAIN: instead of this
  // vec3 color=vec3(0.);
  // we multiply baseColor anf lighting
  vec3 color=baseColor*lighting;
  
  gl_FragColor=vec4(color,1.);
}