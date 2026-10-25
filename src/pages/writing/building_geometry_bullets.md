---
title: "Building Geometry Bullets"
date: "2026-03-24"
updated: "2026-10-25"
layout: "../../layouts/WritingLayout.astro"
category: "project"
posted: true
---

This game was an experiment, and a nice one. The goal was to make my dream game (a fast 2D shooter) in vanilla JS, with a bundle size as small as possible. It was achievedaith a single HTML file of ~14kb (~5kb gzipped) and implements all the features I envisioned.

Btw, here is the [code](https://github.com/Onassis-dev/geometry_bullets) and you can play at [geometrybullets.onassis.dev](https://geometrybullets.onassis.dev/) on a PC.

## Why build this?

My goal was to improve my JavaScript skills; after some hundreds of thousands of lines written in both frontend and backend, I felt making another webapp wasn't going to teach me a lot. So I decided to let my creativity run free, and the idea of the game came to my mind.

I would develop a full game for the browser. I wouldn't use any runtime dependency (I used TypeScript and Vite as dev dependencies). The game loop, rendering, positions, collisions, sounds, camera. I would implement everything by myself, so I could also learn a thing or two about math and game dev.

## How did I achieve it?

First of all the **rendering**. I used the canvas 2D API. I didn't import any sprites, only circles, rectangles and polygons.

For the **camera** I used a relative positioning technique. If you add a 2D position to every entity, you end up with a fixed camera; I needed the camera to follow the player. So I kept the absolute positions, but when an entity is painted to the canvas, it is painted at a position relative to the player—for example, if the player is at `(10,10)` and an enemy is at `(30,30)`, when rendering, the player is drawn at `(0,0)`, which is the center of the canvas, and the enemy at `(20,20)`, which is where it would appear if the player were at `(0,0)`. A simple subtraction does the work.

But the game doesn't run by itself, so a **render loop** is needed. This was fairly simple: you set up a recursive function with `requestAnimationFrame`; every time you finish a frame, you schedule another and the game continues. `requestAnimationFrame` passes a parameter to the callback—it's the time when the frame started, relative to the first render of the page. That gives you the basis for delta time: set a variable `lastRender` to the timestamp of the previous render, then `deltaTime = currentRender - lastRender` gives you the time between renders; at 60fps that's roughly 16ms.

To spawn the enemies, set a recursive `setTimeout` that creates an enemy every x milliseconds. It's important to use `setTimeout` and not `setInterval`, because when the player changes difficulty, the interval changes. With `setInterval`, once it's initialized, it's pretty complicated to change the interval.

Every asset is an object. Yes, I'm using OOP. The game only requires a few classes; the `Entity` class is the root of the rest, then there are the `RelativeEntity`, `Player`, `Enemy` and `Bullet` classes.

For the player to move, you can't just use `window.addEventListener("keypress", callback)`. That only fires once per keypress. We need the player to move for as long as a key is held, so instead I used a simple input tracker. Every time it receives a `keydown` event, it sets the pressed key to `true` in an object, and on `keyup` it sets it to `false`; then every frame the game checks whether a key is currently pressed and moves accordingly.

For shooting and teleporting I did use the `keypress` event.

Everything had been pretty simple up to this point. The next steps are all math and trigonometry.

To aim the player at the mouse pointer, you need the difference in position between the center of the canvas and the current mouse position; then use `Math.atan2()` to get the angle in radians.

```js
  pointToMouse() {
    const dx = mouseX - canvas.width / 2;
    const dy = mouseY - canvas.height / 2;

    this.angle = Math.PI / 2 - Math.atan2(dx, dy);
  }
```

Similarly, to move the enemies toward the player you get the difference in position between them, get the distance using the [Euclidean distance formula](https://en.wikipedia.org/wiki/Euclidean_distance), and change x and y proportionally to that vector relative to the distance. That's cheaper on the CPU than using `sin` and `cos`.

```js
  moveTowardsPlayer() {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / distance) * this.speed * deltaTime;
    this.y += (dy / distance) * this.speed * deltaTime;
  }
```

To move the bullet we only have speed and direction; with that we can calculate the legs of a right triangle using `cos` and `sin` (speed is the hypotenuse, x and y the other sides). We also set limits so the bullet is removed once it's far enough.

```js
  advance() {
    if (this.x > 3000 || this.x < -3000 || this.y > 3000 || this.y < -3000) {
      bulletList.splice(bulletList.indexOf(this), 1);
    }
    this.x += this.speed * Math.cos(this.angle) * deltaTime;
    this.y += this.speed * Math.sin(this.angle) * deltaTime;
  }
```

Finally we need collision detection. Each enemy checks its distance to every bullet; if the distance is less than the sum of their radii, they're colliding (every enemy and bullet is a circle for practicality).

```js
    checkCollisionWithBullet() {
        for (let i = 0; i < bulletList.length; i++) {
            if (checkCollision(this, bulletList[i])) {
            enemyList.splice(enemyList.indexOf(this), 1);
            incrementScore();
            playPopAudio();
            }
        }
    }
```

We use basically the same approach to check whether the player is touching any enemy.

To generate sound I used the [AudioContext API](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext). It lets you synthesize sounds in code, so we don't need heavy MP3s. Here is an example of an audio function:

```js
export function playClickAudio() {
  ensureRunning();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  const t0 = ctx.currentTime;
  const duration = 0.028;
  osc.frequency.setValueAtTime(1040, t0);
  osc.frequency.exponentialRampToValueAtTime(620, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.11, t0 + 0.0015);
  gain.gain.exponentialRampToValueAtTime(0.0008, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.008);
}
```

All the audio functions were generated with AI; I'm not messing with audio more than I have to. At a high level, it just makes a click sound.

The menu, difficulty, score and other nuances were pretty simple and I don't think they deserve to be explained.

## Final thoughts

This was a pretty fun and complex journey. I have now officially developed a game, and a fun one. I learned a lot in the process. If you're a developer looking to improve, I seriously recommend coding something a bit absurd, in my case it was a 14kb JS game, but anything will do, you'll learn and have fun with it 😁