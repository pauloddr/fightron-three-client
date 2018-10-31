import { Object3D, MeshToonMaterial, AmbientLight, DirectionalLight } from 'three'
import { BaseInjector } from './BaseInjector'
import { Mesh } from '../three/Mesh'
import { relativeScale, relativePosition } from '../utils/relative-vectors'

export class ItemInjector extends BaseInjector {
  inject (resource) {
    if (resource.renderable) {
      console.warn('E-II-DUP', resource.id)
      return
    }
    for (var part of resource.parts) {
      var type = part.resourceType
      if (type === 'g') {
        createMesh(part, this.client)
      } else if (type === 'p') {
        createPoint(part)
      } else if (type === 'l') {
        createLight(part)
        /* debug */
        // if (part.lightType === 'd') {
        //   var helper = new DirectionalLightHelper(part.renderable, 50)
        //   this.client.scene.add(helper)
        //   this.client.scene.add(part.renderable.target)
        //   helper.update()
        //   helper = new CameraHelper(part.renderable.shadow.camera)
        //   this.client.scene.add(helper)
        // }
      } else {
        console.warn('E-II-T', resource.id, type)
        continue
      }
      update(part)
    }
    resource.renderable = resource.parts[0].renderable // root
    if (!resource.renderable) {
      console.warn('E-II-SC', resource.id)
      return
    }
    this.client.scene.add(resource.renderable)
  }
}

function createMesh (part, client) {
  var geometry = client.geometries.find(part.resourceId).renderable
  if (!geometry) {
    console.warn('E-II-GR', part.resourceId)
    return
  }
  part.renderable = new Mesh(geometry, new MeshToonMaterial({ color: part.color || 'white' }))
  part.renderable.castShadow = part.castShadow
  part.renderable.receiveShadow = part.receiveShadow
}

function createPoint (part) {
  part.renderable = new Object3D()
}

function createLight (part) {
  if (part.lightType === 'a') {
    part.renderable = new AmbientLight(part.color)
  } else if (part.lightType === 'd') {
    var light = new DirectionalLight(part.color, part.intensity || 1)
    light.castShadow = part.castShadow
    // light.shadow.bias = 0.0008
    light.shadow.mapSize.width = 8192
    light.shadow.mapSize.height = 2048
    light.shadow.camera.far = 2500
    light.shadow.camera.top = 800
    light.shadow.camera.bottom = -800
    light.shadow.camera.left = -3000
    light.shadow.camera.right = 3000
    light.shadow.camera.radius = 1
    part.renderable = light
  }
}

function update (part) {
  var renderable = part.renderable
  if (!renderable) {
    console.warn('E-II-UP', part.resourceType, part.resourceId, part.id)
    return
  }
  renderable.name = `${part.item.id}-${part.id}`
  var position = relativePosition(part)
  renderable.position.set(position.x, position.y, position.z)
  var rotation = part.rotation
  renderable.rotation.set(rotation.x, rotation.y, rotation.z)
  var scale = relativeScale(part)
  renderable.scale.set(scale.x || 1, scale.y || 1, scale.z || 1)
  var parent = part.parent
  if (parent) {
    parent.renderable.add(renderable)
  }
  if (renderable.outline) {
    renderable.updateOutline()
  }
}
