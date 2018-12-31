import { Mesh as ThreeMesh } from 'three'
// import { relativeScale } from '../utils/relative-vectors'

// const outlineMaterial = new MeshBasicMaterial({ color: 'black', side: BackSide })
// const outlineSize = 2

export class Mesh extends ThreeMesh {
  constructor (geometry, material) {
    super(geometry, material)
    this.outline = false
  }
}
