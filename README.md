# gravityca

Simple experiments with a gravitational simulation on a 2D grid. It's not
strictly a cellular automaton anymore, but the original goal was to have it be
so, hence the name.

This was a course project done for MATH-642 Artificial Life at EPFL under
[Vassilis Papadopoulos](https://vassi.life/).

## Setting up

Not much setup required. Everything should run without any sort of dependencies
or compilation.

The project is split up into a few small experiments, in order I wrote them:

1. a Game of Life implementation using GLSL shaders `src/gol`
2. a (not working) Falling sand simulation using GLSL shaders `src/falling`
3. a (working) Falling sand simulation on CPU using simple p5.js `src/simpleFalling`
4. gravitational simulation `src/gravity`

Ideally, opening `index.html` in any modern browser would work, but there are
now some issues regarding accessing local files: [See MDN Web Docs on the
issue](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp).
The recommendation is thus to start an HTTP server in the directory.

The simplest on any platform would likely be:

```console
git clone https://github.com/sankalpgambhir/gravityca # or the latest link to this repo
cd gravityca/
python -m http.server                                 # actually start the HTTP server
```

(or `python3`, depending on how your platform labels it)

Navigate to [http://localhost:8000](http://localhost:8000) if that works. You
should then be able to navigate to any of the folders and see the animations.

## Interacting

On any of the simulations, left-click randomizes and reinitializes the state.

### For gravity

The gravitational simulation uses a rediscretization scheme. There are controls
for controlling rediscretization parameters and displaying the continuous
backend.

These are written in parentheses in the bottom-right corner of the canvas as
well.

Controls:

- `left-mouse-click` reset state
- `b` display or hide boids backend [default: hidden]
- `↑` (up arrow key) increase `numSteps`, the number of continuous steps before discrete projection [default: 1]
- `↓` (down arrow key) decrease `numSteps`
- `r` enable or disable `regen`, i.e., regeneration of the boids model on every discretization step [default: off]


## External libraries

For completeness and longevity, the two external libraries used here are
statically included:

- p5.js: [https://p5js.org/](https://p5js.org/) --- GNU LGPL v2.1

  For all the drawing and boilerplate
- victor.js: [http://victorjs.org/](http://victorjs.org/) --- MIT License

  2D vector math for boids simulation
