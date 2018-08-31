import {ClientCollection} from '@fightron/client/src/ClientCollection'
import {Geometry} from '@fightron/three/core/Geometry'

export class GeometryCollection extends ClientCollection {
  add (data) {
    var geo = new Geometry(data)
    this.set(geo.name, geo)
  }
}
