The idea that $\tau = 2\pi$ ($\tau$ is the Greek letter Tau, roughly equal to 6.28) stems from a mathematical movement arguing that $\pi$ (3.14) is actually the "wrong" constant to use for circles. [1]

This perspective was popularized by Bob Palais in his essay _“$\pi$ Is Wrong”_ and Michael Hartl in _[The Tau Manifesto](https://twotimespi.dev/why-tau/)_. The core argument centers on the fundamental design of a circle and how we measure angles: [1, 2]

---

## 1. Circles Are Defined by Radius, Not Diameter

By definition, a circle is the set of all points at a fixed distance (the radius, $r$) from a center point. [3]

- Pi ($\pi$) is calculated using the diameter ($d$): $\pi = \frac{\text{Circumference}}{d}$.
- Tau ($\tau$) is calculated using the radius ($r$): $\tau = \frac{\text{Circumference}}{r}$. [4]

Because a diameter is just two radii ($2r$), the circumference is $2\pi r$. Proponents argue that introducing the diameter is an unnecessary, confusing middleman. If you use the radius directly, the circumference is simply $\tau r$. [4, 5]

---

## 2. The Intuition of Fractions (Why $\pi$ is Confusing)

The strongest argument for $\tau$ comes down to radians (measuring angles by walking along the outside of the circle). [6, 7]

If you use $\pi$, a full rotation around a circle is $2\pi$ radians. This means fractions of a circle do not match the fractions of $\pi$: [7, 8]

- A full turn around a circle is $2\pi$ radians.
- A half turn is $\pi$ radians.
- A quarter turn is $\frac{\pi}{2}$ radians. [4, 7]

This introduces unnecessary mental friction when learning trigonometry. If you use $\tau$ to represent a full circle, the fractions instantly align perfectly with the geometry: [6]

|Fraction of a Circle|Angle in Degrees|Angle in Radians using $\pi$|Angle in Radians using $\tau$|
|---|---|---|---|
|Full Turn|360°|$2\pi$|$1\tau$|
|Half Turn|180°|$\pi$|$\frac{\tau}{2}$|
|Quarter Turn|90°|$\frac{\pi}{2}$**|$\frac{\tau}{4}$|
|Three-Quarter Turn|270°|$\frac{3\pi}{2}$|$\frac{3\tau}{4}$|

With Tau, saying "a quarter of a circle" mathematically translates directly to $\frac{\tau}{4}$. [9]

---

## 3. Cleaning Up Famous Equations

Because a full cycle is natively $2\pi$, the number $2\pi$ pops up constantly across physics, engineering, and calculus. Replacing it with $\tau$ cleans up many core equations: [2, 10, 11]

- Euler's Identity: Instead of $e^{i\pi} = -1$, a full complex rotation becomes the elegant $e^{i\tau} = 1$.
- The Normal (Gaussian) Distribution: The standard bell curve formula uses $\frac{1}{\sqrt{2\pi}}$, which simplifies directly to $\frac{1}{\sqrt{\tau}}$. [9]

While $\pi$ remains the deeply historical and universal standard taught in modern textbooks, major programming languages like Python and Rust have officially added `tau` to their math libraries because of how clean it makes periodic formulas! [2, 12]

Would you like to see how the circle area formula changes when using $\tau$ instead of $\pi$, or are you interested in how sine and cosine waves look when plotted out using $\tau$?

  

[1] [https://www.mathnasium.com](https://www.mathnasium.com/blog/tau-constant-better-pi)

[2] [https://thevarsity.ca](https://thevarsity.ca/2022/06/28/tau-day-two-pi-mathematics/)

[3] [https://www.bbc.com](https://www.bbc.com/news/science-environment-13906169)

[4] [https://www.quora.com](https://www.quora.com/Why-do-we-use-2-%CF%80-pi-instead-of-%CF%84-tau-as-it-is-confusing-for-kids-to-use-2-%CF%80-pi-for-a-full-circle-when-learning-trigonometry)

[5] [https://www.tiktok.com](https://www.tiktok.com/@polymathematic/video/7609770548029099295)

[6] [https://www.youtube.com](https://www.youtube.com/watch?v=83ofi_L6eAo&t=315)

[7] [https://attheu.utah.edu](https://attheu.utah.edu/facultystaff/tau-trumps-pi/)

[8] [https://www.scientificamerican.com](https://www.scientificamerican.com/article/let-s-use-tau-it-s-easier-than-pi/)

[9] [https://www.youtube.com](https://www.youtube.com/watch?v=L5YZFqbnytE)

[10] [https://www.reddit.com](https://www.reddit.com/r/math/comments/gib8v/tau_v_pi/)

[11] [https://www.quora.com](https://www.quora.com/What-is-the-reason-for-using-%CF%80-instead-of-TAU-in-mathematics)

[12] [https://en.wikipedia.org](https://en.wikipedia.org/wiki/Tau_%28mathematics%29)