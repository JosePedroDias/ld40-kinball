# Ludum Dare 40 - The more you have, the worse it is

Entry by @jose_pedro_dias and @asilva4000

A pinball game with physics.

Keys are:

* left arrow / Z - left flipper
* right arrow / M - right flipper
* down arrow - launch ball with plunger
* space bar / up arrow / T - tilt table (1 every 10 seconds)

* enter - resumes after level change or game over
* s - sound toggle

(should run on greenfield desktop browsers. Chrome and Firefox run `index.html`
while Edge and Safari run only in `index-compat.html`)

## Changelog

### 1.1 - 2017/12/09

* changed mapping of keys to triggers from 1 to 1 to 1 to many
* replaced contrived logic to control several flippers of the same side
* replaed keys for trigger constants in all levels because of previous changes

## External Credits

### Libraries

* [Matter.js](http://brm.io/matter-js/)
* [poly-decomp](https://github.com/schteppe/poly-decomp.js/)
* [Howler](https://howlerjs.com/)

### Assets

* [Dot Matrix font](https://www.dafont.com/dot-matrix.font) made by
  [Svein Kåre Gunnarson](http://www.dionaea.com/information/fonts.html)
