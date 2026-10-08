# Quaternions


## General


**1. Order these from most compact to least compact to represent, and provide reasoning: Quaternions, Euler Angles, Rotation Matrices**








**2. How are quaternions generally represented? Recall that complex numbers are represented as a + bi**








**3. What advantages do quaternions hold over rotation matrices & euler angles?**








**4. When games store quaternions in a 4D vector, where is the "real" part typically stored?**








**5. Why might you still choose to use Euler angles over quaternions?**








**6. What are a, and i, j, k in a quaternion?**








**7. What advantages do matrices hold over quaternions?**








## Axis Angle


**8. What is the basic formula for constructing a quaternion, given an angle θ and a rotation axis n⃗.**








**9. True/False: Quaternions can be directly calculated from an axis-angle representation**








**10. True/False: You need to normalize the vector component of a quaternion in order to normalize a quaternion.**








**11. True/False: A quaternion and a 4D cartesian vector are normalized in the same way.**








**12. True/False: In axis-angle, the axis is a unit vector**








**13. True/False: The axis-angle representation makes smooth interpolation easy, vs difficulties interpolating Euler angles and rotation matrices.**








**14. True/False: A unit quaternion has length 1.**








**15. Normalize the following quaternion: q = 2 + 2i + 3j + 1k**








**16. Normalize the following quaternion: q = 0.5 + 0.866i + 0j + 0k**








**17. Normalize the following quaternion: q = 0.5 + 0.25i + 0.25j + 0k**








**18. If you have an axis v⃗ = (1, 0, 0) and an angle θ = 30°, construct a unit quaternion from this.**








**19. If you have an axis v⃗ = (0.5, 0, 0.866) and an angle θ = π/3 radians, construct a unit quaternion from this.**








**20. Why is linearly interpolating a vector difficult?**








**21. As a follow-up, if you normalize the vector after interpolating, is this sufficient to interpolate smoothly? If not, explain why.**








**22. Can you think of any cases where linear interpolation of vectors is acceptable?**








**23. What is the relationship between the angle θ in an axis-angle representation, and it's corresponding quaternion?**








## Multiplication & Inverse

**24. True/False: Multiplying quaternions allows you to compose several rotations together.**








**25. True/False: The inverse of a unit quaternion is obtained by negating its components.**








**26. True/False: Multiplying a quaternion by its inverse results in an identity quaternion.**








**27. True/False: The identity quaternion is 0 + 0i + 0j + 0k**








**28. True/False: Quaternion multiplication is commutative.**








**29. Given q1 = 1 + 1i + 1j + 1k and q2 = 1 + 0i + 0j + 0k, calculate q1q2**








**30. Given q1 = 1 + 1i + 1j + 1k and q2 = 0 + 0i + 1j + 0k, calculate q1q2**








**31. Given a quaternion q = a + bi + cj + dk, calculate the inverse**








**32. Explain why negating the vector component of a unit quaternion is sufficient to invert it.**








## Transforming Vectors



**33. True/False: Multiplying a quaternion by its inverse results in the zero quaternion**








**34. True/False: The process transforming a vector is referred to as the sandwich product.**








**35. True/False: Multiplying a quaternion q by the identity quaternion only results in q if q is a unit quaternion.**








**36. True/False: You must "promote" a vector to a quaternion to transform it by a quaternion.**








**37. True/False: Promoting a vector to a quaternion involves copying the xyz components of the vector into the ijk components of the quaternion.**








**38. Explain the steps of transforming a vector v by a quaternion q, in your own words.**








**39. Why do we use θ/2 when defining a rotation quaternion?**








**40. What happens to rotations on the scalar real value when using the sandwich product?**








**41. Explain why, when doing the sandwich product qvq⁻¹, the inverse quaternion q⁻¹ doesn't cancel out the first rotation q.**








**42. Given a quaternion q = 0 + i + 0j + 0k, what rotation is this performing when transforming a vector?**








## SLERP



**43. True/False: Lerp can also be applied to quaternions.**








**44. True/False: Renormalizing a vector after a lerp results in constant angular velocity.**








**45. True/False: Slerp is more computationally expensive than lerp.**








**46. True/False: Lerp can sometimes be useful to use, even if Slerp is available.**








**47. True/False: The formula for lerp, given 2 values A, B, and a value t is A + t * (B - A)**








**48. Explain what linear interpolation, or lerp, does in the context of a bar graph.**








**49. What problem do you suffer from when lerping between 2 unit vectors?**








**50. Explain what angular velocity refers to, in the context of interpolating 2 unit vectors. Demonstrate with an example.**