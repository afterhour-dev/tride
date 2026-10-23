
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
  
  vec3 color=vec3(0.)
  
  gl_FragColor=vec4(color,1.);
}