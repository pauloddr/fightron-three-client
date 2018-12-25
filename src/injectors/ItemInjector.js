import { Object3D, MeshToonMaterial, AmbientLight, DirectionalLight } from 'three'
import { BaseInjector } from './BaseInjector'
import { SkinnedMesh } from '../three/SkinnedMesh'
import { Mesh } from '../three/Mesh'
import { relativeScale, relativePosition } from '../utils/relative-vectors'

// const material = new MeshToonMaterial({skinning: true})

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
  var geometryResource = client.geometries.find(part.resourceId)
  if (!geometryResource) {
    console.warn('E-II-GR', part.resourceId)
    return
  }
  var geometry = geometryResource.renderable
  if (!geometry) {
    console.warn('E-II-RND', part.resourceId, geometryResource.id)
    return
  }
  var mesh, material
  var color = part.color || part.item.color || 'white'
  if (geometryResource.skeleton) {
    material = new MeshToonMaterial({ color, skinning: true, transparent: true, opacity: 0.9 })
    mesh = new SkinnedMesh(geometry, material)
  } else {
    material = new MeshToonMaterial({ color, transparent: true, opacity: 0.9 })
    mesh = new Mesh(geometry, material)
  }
  part.renderable = mesh
  part.renderable.castShadow = part.castShadow
  part.renderable.receiveShadow = part.receiveShadow
}

function createPoint (part) {
  part.renderable = new Object3D()
}

function createLight (part) {
  var color = part.color || part.item.color || 'white'
  if (part.lightType === 'a') {
    part.renderable = new AmbientLight(color)
  } else if (part.lightType === 'd') {
    var light = new DirectionalLight(color, part.intensity || 1)
    light.castShadow = part.castShadow
    // light.shadow.bias = 0.0008
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.far = 25
    light.shadow.camera.top = 8
    light.shadow.camera.bottom = -8
    light.shadow.camera.left = -30
    light.shadow.camera.right = 30
    // light.shadow.camera.radius = 1
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
