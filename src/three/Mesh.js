import { Mesh as ThreeMesh, MeshBasicMaterial, BackSide } from 'three'
// import { relativeScale } from '../utils/relative-vectors'

const outlineMaterial = new MeshBasicMaterial({ color: 'black', side: BackSide })
const outlineSize = 2

export class Mesh extends ThreeMesh {
  constructor (geometry, material) {
    super(geometry, material)
    this.outline = false
    this.outlineMesh = null
  }

  updateOutline () {
    if (!this.outline) {
      return
    }
    if (!this.outlineMesh) {
      this.outlineMesh = new OutlineMesh(this)
    }
    this.outlineMesh.visible = false
    if (this.parent) {
      var parentScale = this.parent.scale
      if (parentScale.x !== 1 || parentScale.y !== 1 || parentScale.z !== 1) {
        // Parent must have a default scale
        console.warn('E-MSH-OL-P', this.name)
        return
      }
      this.parent.add(this.outlineMesh)
      this.outlineMesh.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      )
    } else {
      this.add(this.outlineMesh)
    }
    this.outlineMesh.scale.set(
      this.scale.x + outlineSize,
      this.scale.y + outlineSize,
      this.scale.z + outlineSize
    )
    this.outlineMesh.visible = true
  }
}

class OutlineMesh extends Mesh {
  constructor (mesh) {
    super(mesh.geometry, outlineMaterial)
    this.castShadow = false
    this.receiveShadow = false
  }
}
