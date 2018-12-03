import { Geometry, Face3, Vector3, Vector4, BufferGeometry } from 'three'
import { BaseInjector } from './BaseInjector'

export class GeometryInjector extends BaseInjector {
  inject (resource) {
    if (resource.renderable && resource.renderabe.isBufferGeometry) {
      console.warn('E-GI-DUP', resource.id)
      return
    }
    var geometry = new Geometry()
    geometry.name = resource.id
    loadVertices(resource, geometry)
    loadFaces(resource, geometry)
    var bufferGeometry = new BufferGeometry()
    bufferGeometry.name = resource.id
    bufferGeometry.fromGeometry(geometry)
    geometry.dispose()
    resource.renderable = bufferGeometry
    loadBones(resource, bufferGeometry)
    resource.renderable = bufferGeometry
  }
}

function loadVertices (resource, geometry) {
  for (var vertex of resource.vertices) {
    geometry.vertices.push(new Vector3(vertex.x, vertex.y, vertex.z))
    loadVertexSkinning(vertex, resource, geometry)
  }
  geometry.verticesNeedUpdate = true
}

function loadFaces (resource, geometry) {
  for (var face of resource.faces) {
    loadFace(face, resource, geometry)
  }
  geometry.computeFaceNormals()
}

function loadFace (face, resource, geometry) {
  var normals
  var fN = face.normals
  if (fN) {
    normals = [
      new Vector3(fN.a.x, fN.a.y, fN.a.z),
      new Vector3(fN.b.x, fN.b.y, fN.b.z),
      new Vector3(fN.c.x, fN.c.y, fN.c.z)
    ]
  }
  geometry.faces.push(new Face3(face.a.index, face.b.index, face.c.index, normals, null, face.materialIndex))
}

function loadBones (resource, geometry) {
  var rbones = resource.bones
  if (!rbones) {
    return
  }
  var gbone, rbone, i, parentIndex
  var len = rbones.length
  var gbones = []
  geometry.bones = gbones
  // geometry bone should follow format used by SkinnedMesh
  // reference: https://github.com/mrdoob/three.js/blob/dev/src/objects/SkinnedMesh.js
  for (i = 0; i < len; ++i) {
    rbone = rbones[i]
    gbone = {
      name: rbone.id,
      pos: [rbone.position.x, rbone.position.y, rbone.position.z],
      rotq: [0, 0, 0, 1] // quaternion rotation, required by SkinnedMesh
    }
    if (i === 0) {
      // reset position of the root bone
      gbone.pos = [0, 0, 0, 0]
    }
    parentIndex = undefined
    if (rbone.parent) {
      parentIndex = rbones.indexOf(rbone.parent)
      if (parentIndex >= 0) {
        gbone.parent = parentIndex
      }
    }
    gbones.push(gbone)
  }
}

function loadVertexSkinning (vertex, resource, geometry) {
  if (!resource.skeleton) {
    return
  }
  var indices, weights, vs
  if (vertex.skinning) {
    indices = [0, -1, -1, -1]
    weights = [0, 0, 0, 0]
    for (vs in vertex.skinning) {
      indices[vs] = vertex.skinning[vs].i
      weights[vs] = vertex.skinning[vs].w
    }
    geometry.skinIndices[vertex.index] = new Vector4(...indices)
    geometry.skinWeights[vertex.index] = new Vector4(...weights)
  } else {
    geometry.skinIndices[vertex.index] = new Vector4(0, -1, -1, -1)
    geometry.skinWeights[vertex.index] = new Vector4(1, 0, 0, 0)
  }
}
