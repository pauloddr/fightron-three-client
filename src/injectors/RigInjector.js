import { BaseInjector } from './BaseInjector'
import { Bone } from 'three'

export class RigInjector extends BaseInjector {
  inject (resource) {
    if (resource.renderable) {
      console.warn('RigInjector', 'possible duplicate ID', resource.id)
      return
    }
    if (!resource.skeleton) {
      console.warn('RigInjector', 'skeleton not available', resource.id)
      return
    }
    createBones(resource)
  }
}

function createBones (resource) {
  var _bone, bone, parent
  var _bones = resource.skeleton.bones
  var bones = []
  for (_bone of _bones) {
    bone = new Bone()
    bone.name = _bone.id
    bone.position.set(_bone.position.x, _bone.position.y, _bone.position.z)
    bone.rotation.order = _bone.rotationOrder
    resource.bones.set(bone.name, bone)
    parent = _bone.parent
    if (parent) {
      resource.bones.get(parent.id).add(bone)
    }
    bones.push(bone)
  }
  resource.renderable = bones[0]
  /* debug */
  // var helper = new THREE.SkeletonHelper(this.skeleton.bones[0])
  // helper.material.linewidth = 3
  // this.root.add(helper)
}
