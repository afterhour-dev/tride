# Shadow - Point Light

Exploring shadows with point light.

## Namera / Intent

Cilje je razumeti sta sve mozemo da uradimo u smislu shadow-a, kada imamo point light.

## Šta treba objasniti u detalje

- shadow camera helper is a bit strange, has strange position when you add it to the scene
- shadow camera helper seems to be PerspectiveCamera facing negative z to me. Is it because point light is iluminating in every direction and therefore camera helper can't help much? (when we say all directions do we think of 6 directions?)
- so, three.js uses PerspectiveCamera for point light but in all 6 directions and finishes in negative z (I see some older example where it finishes downward which is negative y?)