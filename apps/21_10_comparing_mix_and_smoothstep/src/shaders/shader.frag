
varying vec2 vUvs;

void main(){
  
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.);
  vec3 black=vec3(0.);
  
  // EXPLAIN: step 1 --> let's try using values that goes from
  // -0.5 to 0.5 for color values, but t oget those values
  // we will subtract uv.y by 0.5
  // color=vec3(vUvs.y-.5);
  
  // EXPLAIN: step2 --> using abs
  // color=vec3(abs(vUvs.y-.5));
  
  // EXPLAIN: step3 --> keeping this as a separate variable
  // because we are going to reuse it
  // float line=abs(vUvs.y-.5);
  // color=vec3(line);
  
  // EXPLAIN: step4 --> making we don't want gradient in the middle,
  // we want just a black line
  // EXPLAIN: by using step
  // float line=step(.005,abs(vUvs.y-.5));
  // color=vec3(line);
  // EXPLAIN: by using smoothstep
  // float line=smoothstep(0.,.005,abs(vUvs.y-.5));
  // color=vec3(line);
  
  // EXPLAIN: I put here our line here
  // comment out step or smoothstap way to test it
  float line=smoothstep(0.,.005,abs(vUvs.y-.5));
  // float line=step(.005,abs(vUvs.y-.5));
  
  // EXPLAIN: step5 --> interpolating colors for upper part of
  // plain and bottom part of plain
  
  if(vUvs.y>.5){
    // EXPLAIN: interpolation on upper part of plain
    color=mix(red,blue,vUvs.x);
  }else{
    // EXPLAIN: interpolation on lower part of plain
    // it is smoothstep between 0.0 and 1.0 since we want even
    // interpolation (did I word it right?)
    color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  }
  
  // EXPLAIN: step6 --> we lost the division line, as you can see
  // we are not using it anywhere above so we will interpolate
  // white with current color, assuming this will give you existing
  // color grdient we made before but we are going to use line value as fraction(the third argument)
  // which will make line to be white
  // color=mix(white,color,line);
  // EXPLAIN: but since I want line to be black I did it like this
  color=mix(black,color,line);
  
  gl_FragColor=vec4(color,1.);
}