// EXPLAIN: these .frag and .vert files aren't loaded
// because I just want to exploe how to write GLSL

// EXPLAIN: different loops

// EXPLAIN: for loop
for(int i=0;i<10;i++){
  // statements
  
  // EXPLAIN: standard flow control
  // EXPLAIN: break ; it breaks a loop
  break;
  // EXPLAIN: continue; breacks current iteration and continues
  // next one
  continue;
  // EXPLAIN: return; I assume it exits the function
  return;
}

// EXPLAIN: while loop
int i=0;
while(i<10){
  // statements
  i++;
}

// EXPLAIN: do while loop
int j=0;
do{
  // statements
  j++;
}while(j<10)

// EXPLAIN: if else, else if

bool condition=true;
bool other_condition=false;
bool more_conditios=false;

if(condition){
  // statement
}else{
  if(other_condition){
    // statements
  }else if(more_conditios){
    // statements
  }else{
    // even more statements
  }
}

// EXPLAIN: does glsl have AND, OR, NEGATION logical operators

// EXPLAIN: does glsl have bitwise operators

// EXPLAIN: switch statemenr

int i=0;

switch(i){
  case 0:
  // statements
  break;
  
  case 1:
  // statements
  break;
  
}

// EXPLAIN: are ther other types of loops like for in