import { Geometry, Vector3, Face3 } from 'three'
import { BaseInjector } from './BaseInjector'

export class GeometryInjector extends BaseInjector {
  inject (resource) {
    if (resource.renderable && resource.renderabe.isGeometry) {
      console.warn('E-GI-DUP', resource.id)
      return
    }
    var geometry = new Geometry()
    geometry.name = resource.id
    for (var vertex of resource.vertices) {
      geometry.vertices.push(new Vector3(vertex.x, vertex.y, vertex.z))
    }
    geometry.verticesNeedUpdate = true
    for (var face of resource.faces) {
      geometry.faces.push(new Face3(face.a.index, face.b.index, face.c.index, null, null, face.materialIndex))
    }
    geometry.computeFaceNormals()
    resource.renderable = geometry
  }
}
