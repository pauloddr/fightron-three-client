'use strict'

import { expect } from 'chai'
import { ThreeClient } from '../src/ThreeClient'
import { behaves } from '@fightron/client/test/behaviors'

const MockBrowser = require('mock-browser').mocks.MockBrowser
var mock = new MockBrowser()
var document = mock.getDocument()
var canvas = document.createElement('canvas')
document.body.appendChild(canvas)

class TestClient extends ThreeClient {
  constructor () {
    super(canvas)
  }

  receiveTest (...command) {
    this.receive({ data: JSON.stringify(command) })
  }
}

describe('ThreeClient', function () {
  var testClient = new TestClient()

  before(function () {
    this.client = testClient
  })

  behaves.like.a.Client(testClient)

  describe('injectors', function () {
    it('generates geometries', function () {
      var geometry = this.client.geometries.find('triangle').renderable
      expect(geometry.name).to.equal('triangle')
      expect(geometry.isGeometry).to.equal(true)
      expect(geometry.vertices.length).to.equal(4)
      expect(geometry.faces.length).to.equal(4)
    })

    it('generates points as Object3D', function () {
      var root = this.client.items.find('three-triangles').renderable
      expect(root.isObject3D).to.equal(true)
    })

    it('generates geometries as Mesh', function () {
      var root = this.client.items.find('three-triangles').renderable
      expect(root.children[0].isMesh).to.equal(true)
      expect(root.children[0].children[0].isMesh).to.equal(true)
      expect(root.children[0].children[0].children[0].isMesh).to.equal(true)
    })

    it('generates lights as *Light', function () {
      var light = this.client.items.find('three-triangles').parts[4].renderable
      expect(light.isLight).to.equal(true)
    })
  })
})
