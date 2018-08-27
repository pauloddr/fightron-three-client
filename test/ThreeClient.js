'use strict'

// const expect = require('chai').expect
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
    this.subject = TestClient
  })

  behaves.like.a.Client()
})
