# Cement this in your head

- modulo (`%`) (what I understand about it by using it we get what is remain when we deivide two numers, which means if numbers are divisible, we got 0, if not divisible we got bigest quotient that can be multiplied by divisor to get whole number closet to dividend and the reminder is our result)
  ```ts
  // when dividing
  100 (dividend) / 50 (divisor) = 2 (quotient)

  // when doing modulo  3 * 30 = 90 (closest)    and   100 - 90 = 10 
  100 (dividend) % 30 (divisor) = 10 (reminder)

  // but simetimes the dividend is smaller than divisor
  0 % 5 = 0
  1 % 5 = 1  // how many fives in one ? zero fives. And what remains? divisor 1 remains etc
  2 % 5 = 2
  3 % 5 = 3
  4 % 5 = 4
  5 % 5 = 0
  // you usee how above result is sequence of 0,1,2,3,4,5 and again 0 
  // and if you do
  6 % 5 = 1  // sequence is continuing

  ```

    - one good way you can look at modulo, especially in our exampl or other example where you use iterator
      ```ts
      // let's say this is possible iterator in the loop for example 
      i = 0,1,2,3,4,5,6,7,8,9,10
      // well modulo of 3 of any of these numbers
      0 % 3 = 0
      1 % 3 = 1
      2 % 3 = 2
      3 % 3 = 0
      4 % 3 = 1
      5 % 3 = 2
      6 % 3 = 0
      7 % 3 = 1
      8 % 3 = 2
      9 % 3 = 0
      10 % 3 = 1
      // again sequence but it repeats
      // 0, 1, 2 | 0, 1, 2 | 0, 1, 2 | 0 1
      ``` 
      