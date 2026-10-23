
varying vec2 vUvs;

// uniform float time;

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
vec3 white=vec3(1.);
vec3 black=vec3(0.);

void main(){
  
  vec3 color=vec3(0.);// black
  
  float value1=vUvs.x;
  // EXPLAIN: instead of smoothstep let's raise
  // uv.x by power of 4
  // float value2=smoothstep(0.,1.,vUvs.x);
  // EXPLAIN: what you will notice, is how y will be
  // stuck close to 0, and eventually it will curve more
  // in direction to 1.0 untill it gets there
  // the higher is the power the longer it stays near 0.0 y
  // float value2=pow(vUvs.x,4.);
  // float value2=pow(vUvs.x,8.);
  // EXPPLAIN: what if we choose values bellow 1.0 for power
  // you'll e that it wil lstart curving in other side,
  // you can explain this better
  // float value2=pow(vUvs.x,.5);
  // float value2=pow(vUvs.x,.25);
  // EXPLAIN: this one is famous also I heard, tell me why?
  // it creats curve going to from 0.0 and then forming large amplitude related
  // to multiplier, and then goes down baclk to 0
  float value2=vUvs.x*(1.-vUvs.x)*4.;
  
  float line=smoothstep(
    0.,
    .005,
    abs(vUvs.y-.5)
  );
  
  float linearLine=smoothstep(
    0.,
    .0075,
    abs(vUvs.y-mix(.5,1.,value1))
  );
  
  float smoothLine=smoothstep(
    0.,
    .0075,
    abs(
      vUvs.y-mix(0.,.5,value2)
    )
    
  );
  
  if(vUvs.y>.5){
    color=mix(red,blue,vUvs.x);
    
  }else{
    color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  }
  
  color=mix(black,color,line);
  color=mix(black,color,linearLine);
  color=mix(black,color,smoothLine);
  
  gl_FragColor=vec4(color,1.);
}

