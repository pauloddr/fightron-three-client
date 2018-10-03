import { BaseInjector } from './BaseInjector'
import { Bone } from 'three'

export class RigInjector extends BaseInjector {
  inject (rig) {
    if (rig.renderable) {
      console.warn('E-RI-DUP', rig.id)
      return
    }
    if (!rig.skeleton) {
      console.warn('E-RI-SL', rig.id)
      return
    }
    createBones(rig)
    attachItems(rig)
    this.client.scene.add(rig.renderable)
  }
}

function createBones (rig) {
  var skeletonBone, bone, parent
  var skeletonBones = rig.skeleton.bones
  var bones = []
  for (skeletonBone of skeletonBones) {
    bone = new Bone()
    bone.name = skeletonBone.id
    bone.position.set(
      skeletonBone.position.x,
      skeletonBone.position.y,
      skeletonBone.position.z
    )
    bone.rotation.order = skeletonBone.rotationOrder
    rig.bones.set(bone.name, bone)
    parent = skeletonBone.parent
    if (parent) {
      rig.bones.get(parent.id).add(bone)
    }
    bones.push(bone)
  }
  rig.renderable = bones[0]
  /* debug */
  // var helper = new THREE.SkeletonHelper(this.skeleton.bones[0])
  // helper.material.linewidth = 3
  // this.root.add(helper)
}

function attachItems (rig) {
  if (!rig.renderable) {
    console.warn('E-RI-AI-NR', rig.id)
    return
  }
  var bone
  for (var rigItem of rig.items) {
    bone = rig.bones.get(rigItem.slot)
    if (!bone) {
      console.warn('E-RI-AI-B', rig.id, rigItem.slot)
      continue
    }
    var itemRenderable = rigItem.item.renderable
    if (!itemRenderable) {
      console.warn('E-RI-AI-IR', rig.id, rigItem.item.id)
      continue
    }
    bone.add(itemRenderable)
  }
}
