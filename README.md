# @fightron/three-client

[ThreeJS](https://threejs.org/) Game Client.

Refer to [__@fightron/client__](https://github.com/fightron/client) for base documentation.

## Usage

ThreeJS requires a `<canvas>` element to render, so you must provide it in the constructor:

```js
const {ThreeClient} = require('@fightron/three-client')

var client = new ThreeClient(document.getElementById('id-of-canvas-element'))
```

The element doesn't need to have CSS styles. The client instance will style it automatically:

* Fills the container, always keeping a 16/9 aspect ratio.
  * Unfilled areas will show the page's background. Those are not handled by the client.
* Minimum width of 1024 and minimum height of 576 pixels.
