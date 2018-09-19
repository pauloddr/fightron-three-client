# @fightron/three-client

[![Build Status](https://travis-ci.com/pauloddr/fightron-three-client.svg?branch=master)](https://travis-ci.com/pauloddr/fightron-three-client)
[![Coverage Status](https://coveralls.io/repos/github/pauloddr/fightron-three-client/badge.svg?branch=master)](https://coveralls.io/github/pauloddr/fightron-three-client?branch=master)

[ThreeJS](https://threejs.org/) Game Client.

Refer to [__@fightron/client__](https://github.com/pauloddr/fightron-client) for base documentation.

## Usage

ThreeJS requires a `<canvas>` element to render, so you must provide it in the constructor:

```js
const {ThreeClient} = require('@fightron/three-client')

var client = new ThreeClient(document.getElementById('id-of-canvas-element'))
```

The client instance will automatically style the canvas element to fill its container.
