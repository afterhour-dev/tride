
varying vec2 vUvs;

// EXPLAIN: we need normal for
// hemispheric lighting, so we declare it as varying
varying vec3 vNormal;

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
  
  // EXPLAIN: in fragment shader you need to renormalize the normal
  vec3 normal=normalize(vNormal);
  
  // EXPLAIN: adding ambient light
  vec3 ambient=vec3(.5);
  
  // EXPLAIN: hemi (roughly choosen some colors)
  vec3 skyColor=vec3(0.,.3,.6);
  vec3 groundColor=vec3(.6,.3,.1);
  
  float hemiFraction=remap(normal.y,-1.,1.,0.,1.);
  vec3 hemi=mix(groundColor,skyColor,hemiFraction);
  
  // EXPLAIN: and then lighting is sum of all lighting
  // sources
  // lighting+=ambient;
  
  // EXPLAIN: for a moment set ambient to zero by multipling
  // it by zero and andd hemi light
  lighting=ambient*0.+hemi;
  
  // EXPLAIN: instead of this
  // vec3 color=vec3(0.);
  // we multiply baseColor anf lighting
  vec3 color=baseColor*lighting;
  
  // EXPLAIN: to breifly visualize the normal
  // color=normal;
  
  gl_FragColor=vec4(color,1.);
}