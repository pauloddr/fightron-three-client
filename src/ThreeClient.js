import { Client } from '@fightron/core/client'
import { WebGLRenderer, PerspectiveCamera, Scene, Color } from 'three'
import { OutlineEffect } from './effects/OutlineEffect'
import { GeometryInjector } from './injectors/GeometryInjector'
import { ItemInjector } from './injectors/ItemInjector'

export class ThreeClient extends Client {
  constructor (canvas) {
    if (!canvas) {
      throw new Error('THREE_CLIENT_REQUIRES_CANVAS_ELEMENT')
    }
    super()
    this.geometries.injector = new GeometryInjector(this)
    this.items.injector = new ItemInjector(this)
    this.canvas = canvas
    this.initialize()
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
    var rAF = this.window.requestAnimationFrame
    if (rAF) {
      this.nextFrameFn = rAF.bind(this.window)
    }
    var performance = this.window.performance
    if (performance) {
      this.fps.now = performance.now.bind(performance)
    }
    // WebGL options
    this.alpha = true
    this.antialias = true
    this.power = 'default' // 'high-performance', 'low-power' or 'default'
    this.shadows = true
    // Stylize canvas to fill container
    var s = this.canvas.style
    s.position = 'absolute'
    // s.top = s.bottom = s.left = s.right = 0
    s.border = '5px dashed red'
    this.initializeRenderer()
    this.scene = new Scene()
    this.scene.background = new Color(this.color)
    this.camera = new PerspectiveCamera(
      20 /* FOV angle */,
      1 /* aspect ratio - will be updated by resize() */,
      1 /* near */,
      100000 /* far */
    )
    this.camera.position.z = 1200
    this.camera.position.y = 140
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
    setTimeout(this.resize, 100)
  }

  resize () {
    var window = this.window
    var width = window.innerWidth
    var height = window.innerHeight
    if (width === 0 || height === 0) {
      this.resizing = false
      return
    }
    if (this.renderer) {
      this.renderer.setSize(width, height)
    }
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.resizing = false
  }

  renderFrame () {
    if (this.effect) {
      this.effect.render(this.scene, this.camera)
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  dispose () {
    this.rendering = false
    this.window.removeEventListener('resize', this.resizeStart)
    this.renderer.dispose()
    this.effect = null
    super.dispose()
  }
}
