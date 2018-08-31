'use strict'

import {expect} from 'chai'
import {ThreeClient} from '../src/ThreeClient'
import {behaves} from '@fightron/client/test/behaviors'

const MockBrowser = require('mock-browser').mocks.MockBrowser
var mock = new MockBrowser()
var document = mock.getDocument()
var canvas = document.createElement('canvas')
document.body.appendChild(canvas)

class TestClient extends ThreeClient {
  constructor () {
    super(canvas)
  }
}

describe('ThreeClient', function () {
  before(function () {
    this.client = new TestClient()
  })

  behaves.like.a.Client()

  describe('after load', function () {
    it('generates geometries', function () {
      var geometry = this.client.geometries.get('triangle')
      expect(geometry.isGeometry).to.equal(true)
      expect(geometry.vertices.length).to.equal(4)
      expect(geometry.faces.length).to.equal(4)
    })

    it('generates spawns', function () {
      //
    })
  })
})
