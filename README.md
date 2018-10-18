# @fightron/three-client

[![Build Status](https://travis-ci.com/pauloddr/fightron-three-client.svg?branch=master)](https://travis-ci.com/pauloddr/fightron-three-client)
[![Coverage Status](https://coveralls.io/repos/github/pauloddr/fightron-three-client/badge.svg?branch=master)](https://coveralls.io/github/pauloddr/fightron-three-client?branch=master)

[ThreeJS](https://threejs.org/) Game Client.

Refer to [__@fightron/core/client__](https://github.com/pauloddr/fightron-core/blob/master/client/README.md) for base documentation.

## Usage

ThreeJS requires a `<canvas>` element to render, so it must be provided in the constructor:

```js
const {ThreeClient} = require('@fightron/three-client')

var canvas = document.getElementById('id-of-canvas-element')
var client = new ThreeClient(canvas)
```

## WIP

This is a work in progress.
