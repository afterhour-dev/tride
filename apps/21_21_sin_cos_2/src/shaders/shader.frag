
varying vec2 vUvs;

uniform float time;

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

vec3 red=vec3(1.,0.,0.);
vec3 blue=vec3(0.,0.,1.);

void main(){
  
  vec3 color=vec3(0.);
  
  // EXPLAIN: clearing out this from previous lesson
  /*
  float t=sin(time);
  t=remap(t,-1.,1.,0.,1.);
  color=mix(red,blue,t);
  */
  
  // EXPLAIN: to get vectical pattern "stripes"
  // float t=sin(vUvs.x*100.);
  // EXPLAIN: we can use y component instead
  // to have horizontal pattern
  float t=sin(vUvs.y*100.);
  
  color=vec3(t);
  
  gl_FragColor=vec4(color,1.);
}

