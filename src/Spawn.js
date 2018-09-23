import { Spawn as BaseSpawn } from '@fightron/client/src/Spawn'
import { Object3D, Mesh, AmbientLight } from 'three'

export class Spawn extends BaseSpawn {
  geometry (part) {
    var geometry = this.client.geometries.get(part.rI)
    return new Mesh(geometry, this.client.materials.default)
  }

  point (part) {
    return new Object3D()
  }

  light (part) {
    // TODO
    return new AmbientLight(0x404040)
  }
}
