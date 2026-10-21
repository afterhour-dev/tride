
varying vec2 vUvs;

void main(){
  
  // ---------------------------------------------------------
  // EXPLAIN: what we did in previous lesson:
  // I want to leave this here to show you what we di in previous lesson
  // so far
  /*
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.);
  vec3 black=vec3(0.);
  
  float line=smoothstep(0.,.005,abs(vUvs.y-.5));
  // float line=step(.005,abs(vUvs.y-.5));
  
  // of the plain
  if(vUvs.y>.5){
    color=mix(red,blue,vUvs.x);
  }else{
    color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  }
  
  // color=mix(white,color,line);
  color=mix(black,color,line);
  
  gl_FragColor=vec4(color,1.);
  
  */
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.);
  vec3 black=vec3(0.);
  
  float line=smoothstep(
    0.,
    .005,
    abs(vUvs.y-.5)
  );
  // float line=step(.005,abs(vUvs.y-.5));
  
  // EXPLAIN: let's create another values for another line
  // let's make it a little bit thicker than line
  float linearLine=smoothstep(
    0.,
    .0075,
    // EXPLAIN: pay attention here for this mix
    // especially on ranges, these ranges are between
    // where linear line starts and where it should end
    // again we need to think about this, what is going to be
    // zeroed out because it is negative
    // this mix is most confusing for me because
    // it goes from 0.5 and that is y value
    // it can go to 1.0 which is also I assyme y value but what
    // we are using as a fraction is vUvs.x
    // so mix will give us values from 0.5 to 1.0;
    // what I assume that if we look at x y axis, this will give us
    // diagonal, and when we subtract uv values one from another
    // I can assume that values form some kind of diagonal but
    // maybe you have better explanation, maybe you can show me
    // some values and how they form diagonal
    abs(vUvs.y-mix(.5,1.,vUvs.x))
  );
  
  // EXPLAIN: let's create another values for the line
  // that would resemble smoothstep function
  // for the start it can be a linear line we want
  // to draw at the bottom part of plain
  float smoothLine=smoothstep(
    0.,
    .0075,
    // EXPLAIN: we need different range, from 0.0 to 0.5
    // abs(vUvs.y - mix(0.0,0.5, vUvs.x))
    // EXPLAIN: let's now trie to oblique this to be smoothstep
    // EXPLAIN: I played around a little and this
    // will make curve going from 0,0 to 1,1, and when we
    // draw it it is curved indeed
    // abs(vUvs.y - smoothstep(0.0, 1.0, vUvs.x))
    // EXPLAIN: but let's try placing it between 0,0 and 1,0.5
    // this alo didn't work, it showed curve but it looks wrong
    // abs(vUvs.x - smoothstep(0.0, 0.5, vUvs.y))
    // EXPLAIN: this one worked, but it has another smoothstep
    // which is also hard for me to imagine, so I would need better
    // explanation from you
    abs(
      vUvs.y-mix(0.,.5,smoothstep(0.,1.,vUvs.x))
    )
    
  );
  
  // EXPLAIN: we don't need to change anything here
  // these are gradients for top and bottom side
  // of the plain, and theh are blending horizontaly
  if(vUvs.y>.5){
    color=mix(red,blue,vUvs.x);
    
  }else{
    color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  }
  
  // color=mix(white,color,line);
  color=mix(black,color,line);
  
  // EXPLAIN: let's interpolate with linear line
  // which will produce
  color=mix(black,color,linearLine);
  
  // EXPLAIN: let's interpolate here so our second line
  // can be drown
  color=mix(black,color,smoothLine);
  
  // EXPLAIN: just to see linear or smooth line only and
  //
  // color=vec3(linearLine);
  // color=vec3(smoothLine);
  
  gl_FragColor=vec4(color,1.);
  
}