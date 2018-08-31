# @fightron/three-client

[ThreeJS](https://threejs.org/) Game Client.

Refer to [__@fightron/client__](https://github.com/fightron/client) for base documentation.

## Usage

ThreeJS requires a `<canvas>` element to render, so you must provide it in the constructor:

```js
const {ThreeClient} = require('@fightron/three-client')

var client = new ThreeClient(document.getElementById('id-of-canvas-element'))
```

The client instance will automatically style the canvas element to fill its container.
