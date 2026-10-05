# Birthday Surprise

A static, single-page birthday experience. Open `index.html` locally or deploy this folder as the site root on Vercel, Netlify, or GitHub Pages. No build step or backend is required.

## Personalize

Edit the `birthdayConfig` object at the top of `script.js` to change the name, sender, intro line, letter, photo list, captions, and music path. The five supplied photos are in `assets/photo1.jpg` through `photo5.jpg`; replace those files or update the paths to use different images. SVG fallback artwork is included if an image cannot load. The site tries to autoplay a built-in flute-style “Happy Birthday” tune when opened. If the browser blocks autoplay, the tune starts on the first user interaction. To use your own audio instead, add `assets/birthday-music.mp3` and set `music: "assets/birthday-music.mp3"` in the config.

The photo carousel supports touch swipes and mouse dragging. Tap the last card to center it and reveal “Keep going”. Tap the envelope to open the letter. Use the browser back/reload controls to restart, or choose “Relive the surprise” at the end.

