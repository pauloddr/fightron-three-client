import { Client } from '@fightron/core/client';
import { WebGLRenderer, PerspectiveCamera, Scene, Color, PCFSoftShadowMap } from 'three';
import { GeometryInjector } from './injectors/GeometryInjector';
import { ItemInjector } from './injectors/ItemInjector';
import { RigInjector } from './injectors/RigInjector';
import { OutlineEffect } from './effects/OutlineEffect';
import { KeyboardInput, NumpadInput } from '@fightron/inputs';

export class ThreeClient extends Client {
  constructor (canvas) {
    if (!canvas) {
      throw new Error('FATAL-TC-C');
    }
    super();
    this.canvas = canvas;

    // WebGL options
    this.alpha = false;
    this.antialias = true;
    this.power = 'default'; // 'high-performance', 'low-power' or 'default'

    this.initialize();
  }

  initialize () {
    this.initializeWindow();
    super.initialize();
    this.initializeScene();
    this.initializeCamera();
    this.initializeRenderer();
    this.resize();
  }

  initializeWindow () {
    this.document = this.canvas.ownerDocument;
    if (!this.document) {
      throw new Error('FATAL-TC-CD');
    }
    this.window = this.document.defaultView;
    if (!this.window) {
      throw new Error('FATAL-TC-CW');
    }
    var rAF = this.window.requestAnimationFrame;
    if (rAF) {
      this.nextFrameFn = rAF.bind(this.window);
    }
    // Stylize canvas to fill container
    var s = this.canvas.style;
    s.position = 'absolute';
    // s.top = s.bottom = s.left = s.right = 0
    // s.border = '5px dashed red'
    this.resize = this.resize.bind(this);
    this.resizeStart = this.resizeStart.bind(this);
    this.render = this.render.bind(this);
    this.window.addEventListener('resize', this.resizeStart, false);
  }

  initializeCollections () {
    super.initializeCollections();
    this.geometries.injector = new GeometryInjector(this);
    this.items.injector = new ItemInjector(this);
    this.rigs.injector = new RigInjector(this);
  }

  initializeScene () {
    this.scene = new Scene();
    this.scene.background = new Color(this.color);
  }

  initializeCamera () {
    this.camera = new PerspectiveCamera(
      35 /* FOV angle */,
      1 /* aspect ratio - will be updated by resize() */,
      1 /* near */,
      1000 /* far */
    );
    this.camera.position.z = 7; // 55
    this.camera.position.y = 1.8; // 5
  }

  // Must be called after changing certain options.
  initializeRenderer () {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    try {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        context: this.canvas.getContext('webgl2'),
        alpha: this.alpha,
        antialias: this.antialias,
        powerPreference: this.power
      });
      this.renderer.info.autoReset = false;
      this.renderer.shadowMap.enabled = this.shadows;
      this.renderer.shadowMap.type = PCFSoftShadowMap;
      this.effect = new OutlineEffect(this.renderer);
      // this.effect = null
      return true;
    } catch (error) {
      console.warn('E-TC-R', error.message);
      return false;
    }
  }

  initializeInputs () {
    var keyboard = new KeyboardInput(this.window);
    var numpad = new NumpadInput(this.window);
    var dispatcher = this.onInput.bind(this);
    keyboard.dispatch = dispatcher;
    numpad.dispatch = dispatcher;
    this.inputs = [ keyboard, numpad ];
  }

  resizeStart () {
    if (this.resizing) {
      return;
    }
    this.resizing = true;
    setTimeout(this.resize, 100);
  }

  resize () {
    var window = this.window;
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (width === 0 || height === 0) {
      this.resizing = false;
      return;
    }
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.resizing = false;
  }

  renderFrame () {
    if (this.effect) {
      this.effect.render(this.scene, this.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  setRenderablePose (rig, renderable, pose) {
    if (!rig.bones) {
      console.warn('E-TC-PO-RD', rig.id, pose.id);
      return;
    }
    var bone;
    for (var rotation of pose.rotations) {
      bone = rig.bones.get(rotation.id);
      if (!bone) {
        continue;
      }
      if (rotation.position) {
        bone.position.set(rotation.x, rotation.y, rotation.z);
      } else {
        bone.rotation.set(rotation.x, rotation.y, rotation.z);
      }
    }
  }

  setRenderablePosition (renderable, x, y, z) {
    var position = renderable.position;
    // TODO: optimize - it's changing `arguments`
    x = (x || x === 0) ? x : position.x;
    y = (y || y === 0) ? y : position.y;
    z = (z || z === 0) ? z : position.z;
    renderable.position.set(x, y, z);
  }

  setRenderableRotation (renderable, x, y, z) {
    var rotation = renderable.rotation;
    // TODO: optimize - it's changing `arguments`
    x = (x || x === 0) ? x : rotation.x;
    y = (y || y === 0) ? y : rotation.y;
    z = (z || z === 0) ? z : rotation.z;
    renderable.rotation.set(x, y, z);
  }

  setRenderableVisibility (renderable, visible) {
    renderable.visible = visible;
  }

  dispose () {
    this.rendering = false;
    this.window.removeEventListener('resize', this.resizeStart, false);
    this.renderer.dispose();
    this.effect = null;
    super.dispose();
  }
}
