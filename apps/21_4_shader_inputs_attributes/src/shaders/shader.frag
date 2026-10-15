
varying vec2 vUvs;

// EXPLAIN: don't forget that we need to declare varying in fragment shader
// too
varying vec3 vRadeDevColor;

uniform vec3 color_1;
uniform vec3 color_2;

void main(){
  
  // EXPLAIN: I just used our coolor here in inrerpolation
  // vec3 col=mix(color_1,vRadeDevColor,vUvs.y);
  
  // EXPLAIN: or to see better that we have 4 different colors in 4 different corners
  // we can pass it here
  gl_FragColor=vec4(vRadeDevColor,1.);
  // EXPLAIN: So indeEd we have 4 different colors for 4 verices of the plane
  
  // gl_FragColor=vec4(col,1.);
  // gl_FragColor=vec4(vUvs,0.,1.);
  
}

// EXPLAIN: the big takeawy of what we did here is to see
// how 3 types of shader inputs work