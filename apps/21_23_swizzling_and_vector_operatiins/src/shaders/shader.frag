
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

