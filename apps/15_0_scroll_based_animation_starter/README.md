# Scroll based animation starter

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

Important thing in this project:
- cube in the center
- no OrbitControls
- gui
- some HTML content
- CSS

## Namera / Intent

Intent is to:
- learn how to use Threee.js as a background of a classic HTML page
- learn how to make camera translate to follow scroll
- discover some tricks to make it more immersive
- add a parallax animation based on the cursor position
- trigger some animations when arriving at tht corresponding section

Fonts available for these lessons are:
- sans:    @fontsource-variable/manrope 
- serif:    @fontsource-variable/bitter 
- mono:    @fontsource-variable/fira-code

```bsh
pnpm --filter=@td/scroll add @fontsource-variable/manrope @fontsource-variable/bitter @fontsource-variable/fira-code
```
Fon't are not something important in this lesson but I decided to start with nice font that looks nice in cyrilic

## Šta treba objasniti u detalje

- our CSS setup we wrote in `src/style.css`
- our html section elements and canvas element
