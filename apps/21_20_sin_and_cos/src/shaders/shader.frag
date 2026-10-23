
varying vec2 vUvs;

// EXPLAIN: we will use time uniform
uniform float time;

// EXPLAIN: we define inverseLerp and remap
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
  
  // EXPLAIN: to test time
  // it should start black and go to the white pretty quickly
  // because time we are selling isn't in a range from 0 to 1
  // color=vec3(time);
  
  // EXPLAIN: let's fed time into sin, since we know that sin
  // produces valus between -1 and 1
  // the minus part will be zeroed out to 0.0, meaning
  // you will have certain moment where nothing changes
  // from black color , and then
  // when it turns to positive you will see gradient changing
  // to white as time progresses, till it goes to 0.0 again and
  // into negatives
  float t=sin(time);
  // color=vec3(t);
  
  // EXPLAIN: we can use remap to map time value
  // instead -1 to 1, to actually 0 to 1, like this
  t=remap(t,-1.,1.,0.,1.);
  // EXPLAIN: now we have smooth transition from black to white
  // and not waiting a lot of time for black to start
  // blending to white
  // color=vec3(t);
  
  // EXPLAIN: We can introduce colors to have infinite blending
  // red to blue back and forth
  color=mix(red,blue,t);
  
  gl_FragColor=vec4(color,1.);
}

