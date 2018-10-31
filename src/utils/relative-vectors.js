import { Vector3 } from '@fightron/core/3d/Vector3'

// Children objects inherit parent's scale.
// Convert object's absolute scale to a relative scale.
export function relativeScale (object, vector) {
  if (!vector) {
    vector = new Vector3(
      object.scale.x,
      object.scale.y,
      object.scale.z
    )
  } else {
    vector.x = vector.x / object.scale.x
    vector.y = vector.y / object.scale.y
    vector.z = vector.z / object.scale.z
  }
  var parent = object.parent
  return parent ? relativeScale(parent, vector) : vector
}

// Parent scale affects children positioning as well.
export function relativePosition (object, vector) {
  if (!vector) {
    vector = new Vector3(
      object.position.x,
      object.position.y,
      object.position.z
    )
  } else {
    vector.x = vector.x / object.scale.x
    vector.y = vector.y / object.scale.y
    vector.z = vector.z / object.scale.z
  }
  var parent = object.parent
  return parent ? relativePosition(parent, vector) : vector
}
