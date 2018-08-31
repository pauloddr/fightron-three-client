import {Client} from '@fightron/client'
import {ClientCollection} from '@fightron/client/src/ClientCollection'
import {GeometryCollection} from './GeometryCollection'
import {WebGLRenderer} from '@fightron/three/renderers/WebGLRenderer'
import {PerspectiveCamera} from '@fightron/three/cameras/PerspectiveCamera'
import {Spawn} from './Spawn'
import {Scene} from '@fightron/three/scenes/Scene'
import {Color} from '@fightron/three/math/Color'
import {MeshToonMaterial} from 'three'
import {OutlineEffect} from '@fightron/three/effects/OutlineEffect'

export class ThreeClient extends Client {
  constructor (canvas) {
    if (!canvas) {
      throw new Error('THREE_CLIENT_REQUIRES_CANVAS_ELEMENT')
    }
    super()
    this.spawns.objectClass = Spawn
    this.canvas = canvas
    this.initialize()
  }

  initializeCollections () {
    this.geometries = new GeometryCollection(this, 'g')
    this.materials = {
      default: new MeshToonMaterial()
    }
    this.items = new ClientCollection(this, 'i')
    this.spawns = new ClientCollection(this, 's')
    this.characters = new ClientCollection(this, 'ch')
    this.poses = new ClientCollection(this, 'po')
    this.animations = new ClientCollection(this, 'am')
    this.sounds = new ClientCollection(this, 'snd')
  }

  initialize () {
    this.document = this.canvas.ownerDocument
    if (!this.document) {
      throw new Error('THREE_CLIENT_CANVAS_DOCUMENT_ERROR')
    }
    this.window = this.document.defaultView
    if (!this.window) {
      throw new Error('THREE_CLIENT_CANVAS_WINDOW_ERROR')
    }
    // WebGL options
    this.alpha = true
    this.antialias = false
    this.power = 'high-performance' // 'high-performance', 'low-power' or 'default'
    this.shadows = true
    // Stylize canvas to fill container
    var s = this.canvas.style
    s.position = 'absolute'
    s.top = s.bottom = s.left = s.right = 0
    this.initializeRenderer()
    this.scene = new Scene()
    this.scene.background = new Color('grey')
    this.camera = new PerspectiveCamera(
      20 /* FOV angle - adjust this later */,
      1 /* aspect ratio - will be updated by resize() */,
      1 /* near */, 100000 /* far */
    )
    this.resize = this.resize.bind(this)
    this.resizeStart = this.resizeStart.bind(this)
    this.render = this.render.bind(this)
    this.window.addEventListener('resize', this.resizeStart, false)
    this.resize()
  }

  // Must be called after changing certain options.
  initializeRenderer () {
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer = null
    }
    try {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        alpha: this.alpha,
        antialias: this.antialias,
        powerPreference: this.power
      })
      this.renderer.info.autoReset = false
      this.renderer.shadowMap.enabled = this.shadows
      this.effect = new OutlineEffect(this.renderer)
      return true
    } catch (error) {
      console.warn('ThreeClient#initializeRenderer', error.message)
      return false
    }
  }

  resizeStart () {
    if (this.resizing) {
      return
    }
    this.resizing = true
    setTimeout(this.resize, 500)
  }

  resize () {
    try {
      var rect = this.canvas.getBoundingClientRect()
      var width = rect.width
      var height = rect.height
    } catch (error) {
      console.warn('ThreeClient#resize', error)
      this.resizing = false
      return
    }
    if (this.renderer) {
      this.renderer.setViewport(0, 0, width, height)
    }
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.resizing = false
  }

  render () {
    if (!this.rendering) {
      return
    }
    this.window.requestAnimationFrame(this.render)
    if (this.effect) {
      this.effect.render(this.scene, this.camera)
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }
}
