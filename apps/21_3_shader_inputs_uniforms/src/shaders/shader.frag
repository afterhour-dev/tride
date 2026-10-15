
varying vec2 vUvs;

void main(){
  
  // EXPLAIN: remeber from previous lesson is that
  // black to white is in essence the gradient form 0.0 to 1.0
  // we can use that to mix two colors instead
  
  /* gl_FragColor=mix(
    vec4(1.,0.,0.,1.),
    vec4(0.,0.,1.,1.),
    // EXPLAIN: we use here just a fraction to demonstrate
    // you will get some color in with more blue than red
    // this is not a gradient, you need uv for that
    .25
  ); */
  
  // EXPLAIN: so this is going to be gradient because
  // we are using uv coordinates
  // so you can notic complete red on the left and compete blue on the right and
  // in the middle it goes something like purpleish transitioning
  // right to the blue, and left to the red
  // but what is visible that middle is darker than the edges
  gl_FragColor=mix(
    vec4(1.,0.,0.,1.),
    vec4(0.,0.,1.,1.),
    vUvs.x
  );
  
  // EXPLAIN: as homework, why is middle much darker than the edges
  // because intiitevly, if you were to make a gradient yourself
  // the middle would be much brighter. why is the middle of the
  // gradient seemingly darker color than the edges?
  
  // EXPLAIN: here we introduced usage of uniform variable
  
  // gl_FragColor=vec4(vUvs,0.,1.);
  
}