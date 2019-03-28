import { expect } from 'chai';
import { ThreeClient } from '../src/ThreeClient';
import { behaves } from '@fightron/core/test/behaviors';

// https://github.com/jsdom/jsdom/pull/1964 - waiting for merge
import Canvas from 'canvas';
import utils from 'jsdom/lib/jsdom/utils';
utils.Canvas = class CanvasClass {
  constructor (width, height) {
    return Canvas.createCanvas(width, height);
  }
};

const MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();
var document = mock.getDocument();
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);

class TestClient extends ThreeClient {
  constructor () {
    super(canvas);
  }
}

describe('ThreeClient', function () {
  var testClient = new TestClient();

  before(function () {
    this.client = testClient;
  });

  behaves.like.a.Client(testClient);

  describe('ItemInjector', function () {
    it('generates geometries', function () {
      var geometry = this.client.geometries.find('triangle').renderable;
      expect(geometry.name).to.equal('triangle');
      expect(geometry.isBufferGeometry).to.equal(true);
    });

    it('generates points as Object3D', function () {
      var root = this.client.items.find('three-triangles').renderable;
      expect(root.isObject3D).to.equal(true);
    });

    it('generates geometries as Mesh', function () {
      var root = this.client.items.find('three-triangles').renderable;
      expect(root.children[0].isMesh).to.equal(true);
      expect(root.children[0].children[0].isMesh).to.equal(true);
      expect(root.children[0].children[0].children[0].isMesh).to.equal(true);
    });

    it('generates lights as *Light', function () {
      var light = this.client.items.find('three-triangles').parts[4].renderable;
      expect(light.isLight).to.equal(true);
    });
  });

  describe('RigInjector', function () {
    it('generates root bone', function () {
      var root = this.client.rigs.find('triangle-human').renderable;
      expect(root).to.exist();
      expect(root.isBone).to.equal(true);
    });

    it('generates correct bone hierarchy', function () {
      var root = this.client.rigs.find('triangle-human').renderable;
      expect(root.children[0].name).to.equal('Cn');
      expect(root.children[0].children[0].name).to.equal('W');
      expect(root.children[0].children[1].name).to.equal('A');
    });

    it('generates bone dictionary', function () {
      var bones = this.client.rigs.find('triangle-human').bones;
      expect(bones.get('_').isBone).to.equal(true);
      expect(bones.get('H').isBone).to.equal(true);
      expect(bones.get('C').isBone).to.equal(true);
    });

    it('appends meshes to bones', function () {
      var bones = this.client.rigs.find('triangle-human').bones;
      expect(bones.get('H').children[0].isMesh).to.equal(true);
    });
  });
});
