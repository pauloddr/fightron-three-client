import { Mesh, Object3D, MeshToonMaterial, AmbientLight } from 'three'
import { BaseInjector } from './BaseInjector'

const material = new MeshToonMaterial()

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
      } else {
        console.warn('E-II-T', resource.id, type)
        continue
      }
      update(part)
    }
    resource.renderable = resource.parts[0].renderable // root
    this.client.scene.add(resource.renderable)
  }
}

function createMesh (part, client) {
  var geometry = client.geometries.find(part.resourceId).renderable
  part.renderable = new Mesh(geometry, material)
}

function createPoint (part) {
  part.renderable = new Object3D()
}

function createLight (part) {
  part.renderable = new AmbientLight('grey')
}

function update (part) {
  var renderable = part.renderable
  renderable.name = `${part.item.id}-${part.id}`
  var position = part.position
  renderable.position.set(position.x, position.y, position.z)
  var rotation = part.rotation
  renderable.rotation.set(rotation.x, rotation.y, rotation.z)
  var scale = part.scale
  renderable.scale.set(scale.x || 1, scale.y || 1, scale.z || 1)
  var parent = part.parent
  if (parent) {
    parent.renderable.add(renderable)
  }
}
