import { Line as ThreeLine, Geometry, Vector3 } from 'three';

var geometry = new Geometry();
geometry.vertices.push(
  new Vector3(-1, 0, 0),
  new Vector3(1, 0, 0)
);

// var bufferGeometry = new BufferGeometry()
// bufferGeometry.fromGeometry(geometry)
// geometry.dispose()

export class Line extends ThreeLine {
  constructor (material) {
    super(geometry, material);
  }
}
