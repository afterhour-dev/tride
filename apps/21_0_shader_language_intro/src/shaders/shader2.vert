// EXPLAIN: these .frag and .vert files aren't loaded
// because I just want to exploe how to write GLSL

// EXPLAIN: we are talking about types here

// EXPLAIN: all operations, like multiplication
// are component-wise
// so this multiplication
vec3(1.,2.,3.)*vec3(4.,5.,6.);
// will produce this
vec3(1.*4.,2.*5.,3.*6.);

// EXPLAIN: some examples here
vec4 color=vec4(.7.,.4,.1,1);

// EXPLAIN: 4x4 matrix
// EXPLAIN: this is identity matrix. Am I right?
mat4 matrix=mat4(
  1.,0.,0.,0.,
  0.,1.,0.,0.,
  0.,0.,1.,0.,
  0.,0.,0.,1.
);

// EXPLAIN: we use these operations
// EXPLAIN: I assume addition of two vectors is component wise
vec4 v1=color+color;

// EXPLAIN: I assume this is scaling of vector
// since we are multiplying by scalar
vec4 v2=color*2.;

// EXPLAIN: I assume this is Hadamard product
// which means also component wise multiplication
vec4 v3=color*color;

// EXPLAIN: well, here we are transforming vector by matrix
// so I'm assumning this glsl treats vec4 as 1x4 matrices
// so number of columns of first matrix needs to match
// number of columns of second
// and what is produced is matrix with number of rows of first matrix
// and number of columns as second matrix
// and in this case we have as a result a mtrix 4x1
// which is vec4 I assume
vec4 v4=matrix*color;
// EXPLAIN: Does the order matteers when we multiply matrix by vector,
// asking because I saw somewhere that somone wrote color * matrix

// EXPLAIN: well we are here using these incremnt/decrement stuff
//At the end this will be component wise addition/subtraction
v1+=v2;
v2+=v3;

// EXPLAIN: here also new value will be Hadamard product,
// I assume
v3*=v4;

// EXPLAIN: I assume at the end new value will be just component
// wise division
v4/=v1;

// EXPLAIN: so we need to pay attention
// that rows in code here ate actually the columns
mat4 m2=mat4(
  2.,0.,0.,0.,// column 0
  0.,3.,0.,0.,// column 1
  0.,0.,.5,0.,// column 2
  0.,0.,0.,1.// column 3
);

// EXPLAIN: so this is going to be Regular matrix multiplication
mat4 m_result=m2*m1;

// EXPLAIN: but this is going to be componet wise
mat4 m_result_2=matrixCompMult(m2,m1);

// EXPLAIN: I assume there are also non square matrices too

mat2x3 non_square=mat2x3(
  1.,2.,3.,// column 0 (a vec3)
  4.,5.,6.0// column 1 (a vec3)
);

// EXPLAIN: I want to know about type qualifiers
varying vec4 example1;
uniform vec4 example2;