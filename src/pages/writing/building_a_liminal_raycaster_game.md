---
title: "Building a Liminal Raycaster Game"
date: "2026-10-25"
layout: "../../layouts/WritingLayout.astro"
category: "project"
posted: true
---

This game was my first real project with C. The goal was to make a weird and uncanny maze, mostly inspired by the [backrooms](https://en.wikipedia.org/wiki/Backrooms). I used only C and [SDL3](https://wiki.libsdl.org/SDL3/FrontPage), and wrote everything from scratch, including movements, collisions, rendering, etc.

This is not a tutorial but a high-level walkthrough. I will not enter into detail on the math theorems or algorithms mentioned, but you should get an idea of the concepts, and understand them if you already know them or have studied them.

Btw, here is the [code](https://github.com/onassis-salinas/liminal_raycast) and you can play at [liminal-raycast.onassis.dev](https://liminal-raycast.onassis.dev/) on a PC.

## Why build this?

After being a TypeScript enjoyer for 4+ years, I decided to try a real programming language. I had already experimented and built some things with C#, Java, JavaScript, Python and even Scratch. But I had never coded without a [garbage collector](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)). To introduce myself to a lower-level language, my only idea was to build a [raycaster](https://en.wikipedia.org/wiki/Ray_casting), that way I can re-create my first cool game on Scratch and build my own semi-3D render engine without depending on libraries.

I also decided to introduce a harder challenge than a simple raycaster, so I added [non-Euclidean spaces](https://en.wikipedia.org/wiki/Non-Euclidean_geometry) (for example: a room that's way bigger on the inside than on the outside). I thought that it would be easy to implement in a raycaster.

## How did I achieve it?

I started by building a simple 2D game. I used SDL3 to create a window and render Rects on screen, then added a player with position X,Y and an angle. A,D keys would change the angle, and W,S would move it forward along the angle it's facing. To do this you have to add to the X,Y position the magnitude of the vector `px = px + cos(pa) * speed`, `py = py + sin(pa) * speed`. We use sine and cosine because of [trigonometric ratios](https://en.wikipedia.org/wiki/Trigonometry).

Then I added the map. It's just a simple 2D array. If the tile has a 1, it's a wall, if it has a 0, it's floor. I rendered both map and player with [`SDL_RenderRect`](https://wiki.libsdl.org/SDL3/SDL_RenderRect), however this is not important, since any graphics library should be similar. I only use methods to render rects and textures.

Next is the rays. A raycaster works like a bat, you cast a ray in all directions in front of you, and the faster they collide with a wall, the closer that wall is.

This was the first big challenge. I spent some hours trying to implement [DDA (Digital Differential Analyzer)](https://lodev.org/cgtutor/raycasting.html). I read about it and decided to code it from scratch. While the implementation in C was a problem, the concept is very simple: Instead of making each ray walk a fixed distance until it collides, you take its position, in one of the axes, and calculate the opposite axis position if it were moved to the next tile in the selected axis. This is possible because of trigonometry, since you have a side and an angle, you can reconstruct the rest of the measurements of the triangle. You then check if the tile you landed on is a wall. If it is, you stop and save the distance. You do this for both axes and select the shortest distance (the first ray to collide). This algorithm is needed because it offers way more precision for way less CPU cycles than the classic alternative.

After implementing it, there was a bigger challenge, making non-Euclidean spaces. My idea was to make a room be bigger on the inside than the outside, a hall that gets you nowhere no matter how much you walk, a room that takes you back to the room you were just coming from. In a raycaster, you render the walls depending on how far a wall is, by casting a ray until it collides. If I could have a special tile, where, once a ray hits it, it teleports to another tile, and keeps walking until it collides with another wall, adding the distance of the player to the first _entry portal_ and the distance from the _exit portal_ to the wall hit. That was actually enough to make the optical illusion. You can think of it basically as: this wall lets me see inside another room.

But seeing inside was not enough. To complete the illusion the player needs to teleport to the other room, but it cannot look like you teleported, it must be instant and imperceptible, so it looks like you are just walking inside a regular room. To make this, I took the theoretical X and Y position after the player would move each frame, but instead of moving it right away, first I check if that X,Y position is inside a portal tile. If it is, I take the portal X,Y position and subtract it from the player's theoretical position. That position is how far the player is from the portal entry. I add to it the position of the portal exit and then, it looks like you just walked inside, no jump, no flash, just regular walking.

Now, with the rays and the player moving across portals seamlessly, it was time to render the walls in a semi-3D style. This was very easy. I just drew a rectangle for each ray, the closer the hit distance, the taller the rectangle is. Do it for enough rectangles and you get a 3D view.

To add textures, I added a wall texture. It is a 64x64 array with numbers 1,2,3. Each number represents a color. I create it by doing a loop and assigning colors at the game start and passing that image to SDL, which stores it in the GPU RAM, making it very fast. Then, to know which part of the texture to render, I measured the X,Y position of the ray hit, and subtracted it from the tile's X,Y position it hit. This represents the section of the wall it hit. With [`SDL_RenderTexture`](https://wiki.libsdl.org/SDL3/SDL_RenderTexture) I select the strip of the texture I want to render, and how tall to stretch it. I also add a dark filter depending on how far the wall is, so the closer a wall is, the brighter, while the far walls are very dark. This adds both a depth effect and a _flashlight_ effect.

After that only floors and ceiling are missing. This was a very complicated process and I will not explain it since it would be too large. However, you can check out the [tutorial](https://lodev.org/cgtutor/raycasting2.html) I was inspired by. I should add that: floor casting is VERY expensive. It dropped my FPS from 4000 to 50. To fix it I tried to _pixelate_ the floor, my game has a pixelated retro style after all. My idea was that: instead of calculating EACH pixel color, I could only calculate each 2nd or 3rd pixel, and just paint it with its neighbours of the same color. I also stopped rendering each pixel on screen and instead used a dynamic texture. Each frame I would set the color for all the pixels and then send the texture. While this doesn't reduce calculations, it reduces GPU calls. This gave my game the style I desired, improved my FPS to 400 and prevented 4K screens from having horrible performance, since now the amount of floor/ceiling pixel calculation was fixed and does not scale with the resolution.

For the last details I added collisions, so you can't cross walls. This was very simple. I first took the current X,Y coordinates and the next theoretical X,Y on each frame. Then I checked the nextTile if I only moved X. If it is a wall, the player's X doesn't move, same with Y. I calculate them separately so the player _slides_ across a wall instead of completely freezing the movement if moving next to a wall.

Finally I used [Emscripten](https://emscripten.org/) to make my C game work on a browser with [WASM](https://webassembly.org/). It is a very straightforward process. But it reduced the FPS from ~400 on native, to ~55 on browser (It's not because it's capped at my display refresh rate). I do not know a way to reduce this. It seems like the tax to translate SDL calls to [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

## Final thoughts

Overall it was a very challenging experience, building uint32s to represent [ARGB](https://en.wikipedia.org/wiki/RGBA_color_model) colors, literally bit by bit, was amazing as someone who has only programmed in high-level languages. The math and algorithm implementations were a big headache and I spent too many hours on it, debugging bugs in a non-Euclidean space was very hard. But overall it was maybe the most fun challenge I've had. And the result is mind-blowing even when I was the one to build it. Distorted space is weird.
