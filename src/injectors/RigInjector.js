import { BaseInjector } from './BaseInjector';
import { Bone } from 'three';

export class RigInjector extends BaseInjector {
  inject (rig) {
    if (rig.renderable) {
      console.warn('E-RI-DUP', rig.id);
      return;
    }
    if (!rig.skeleton) {
      console.warn('E-RI-SL', rig.id);
      return;
    }
    createBones(rig);
    attachItems(rig);

    // Forcibly adds the rig as a item so it can be positioned
    this.client.items.set(rig.id, rig);

    // Rigs are not visible by default
    rig.renderable.visible = false;

    // Finally, add to scene
    this.client.scene.add(rig.renderable);

    /* debug */
    // var helper = new SkeletonHelper(rig.renderable)
    // helper.material.linewidth = 3
    // this.client.scene.add(helper)
  }
}

function createBones (rig) {
  var skeletonBone, bone, parent;
  var skeletonBones = rig.skeleton.bones;
  var bones = [];
  for (skeletonBone of skeletonBones) {
    bone = new Bone();
    bone.name = skeletonBone.id;
    bone.position.set(
      skeletonBone.position.x,
      skeletonBone.position.y,
      skeletonBone.position.z
    );
    bone.rotation.order = skeletonBone.rotationOrder;
    rig.bones.set(bone.name, bone);
    parent = skeletonBone.parent;
    if (parent) {
      rig.bones.get(parent.id).add(bone);
    }
    bones.push(bone);
  }
  rig.renderable = bones[0];
}

function attachItems (rig) {
  if (!rig.renderable) {
    console.warn('E-RI-AI-NR', rig.id);
    return;
  }
  var bone, parent;
  for (var rigItem of rig.items) {
    bone = rig.bones.get(rigItem.slot);
    if (!bone) {
      console.warn('E-RI-AI-B', rig.id, rigItem.slot);
      continue;
    }
    var mesh = rigItem.item.renderable;
    if (!mesh) {
      console.warn('E-RI-AI-IR', rig.id, rigItem.item.id);
      continue;
    }
    if (mesh.isSkinnedMesh) {
      // remove original bone from hierarchy
      // it will be replaced by the mesh's internal skeleton
      parent = bone.parent;
      parent.remove(bone);
      parent.add(mesh);
      // position the mesh at the former bone's original position
      mesh.position.set(bone.position.x, bone.position.y, bone.position.z);
      // make bones poseable - replace references in original hierarchy
      for (bone of mesh.skeleton.bones) {
        rig.bones.set(bone.name, bone);
      }
    } else {
      // no skinning
      bone.add(mesh);
    }
  }
}
