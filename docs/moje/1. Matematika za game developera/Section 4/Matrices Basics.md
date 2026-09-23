
# What are matrices

They are basically groups of vectors. Not more than that.

Instead being a single list of numbers representing a vector, they are multiple sets of vectors.


![[2026-09-24_00-29.png]]  

# Matrix Sizes

When we say two by two matrix, we think it is a matrix with 2 rows and two columns 

![[2026-09-24_00-30.png]]

This is the first row and a second row

![[2026-09-24_00-31.png]]![[2026-09-24_00-31_1.png]] 

It also have two columns. This is the first column, and second column

![[2026-09-24_00-32.png]]![[2026-09-24_00-33.png]]


There are also 3 by 3 matrices and 4 by 4 matrices

![[2026-09-24_00-34.png]]

![[2026-09-24_00-35.png]]

as yo usee above there don't be just ones and zeros insidee, it can be full set of any numbers that just make sence i nwhat you are trying to do with the matrix

## Non-square matrices?

for example 2 by 3 matrix

![[2026-09-24_00-39.png]]

In game development you almost never run into these, so I wouldn't worry too much about them.


Game dev mostly relly in square matrices which we are covering. But basic linear algebra covers non square ones too.

**Most of game developemt rellys on very specific set of specifically sized square matrices**


In 3D mostly 4x4 with occasional 3x3

![[2026-09-24_00-43.png]]

3x3 will be a part of 4x4 extracted out to use directly t osave memory and time

# We can think of vectors as matrices

Vectors positions and directoons are in a way also a matrices, just ether a row or a column

![[2026-09-24_00-46.png]]

1x2 is called row matrix

typically in math when doing  operations with matrices, they are written the other way around; **as columns**

![[2026-09-24_00-48.png]]

But they can be eather, depending of what situation calls for. (we will lexaplaing this a bit more when we do matrix multiplication)