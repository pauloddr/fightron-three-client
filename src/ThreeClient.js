import {Client} from '@fightron/client'

export class ThreeClient extends Client {
  constructor (canvas) {
    if (!canvas) {
      throw new Error('THREE_CLIENT_REQUIRES_CANVAS_ELEMENT')
    }
    super()
    this.canvas = canvas
    this.document = canvas.ownerDocument
    if (!this.document) {
      throw new Error('THREE_CLIENT_CANVAS_DOCUMENT_ERROR')
    }
    this.window = this.document.defaultView
    if (!this.window) {
      throw new Error('THREE_CLIENT_CANVAS_WINDOW_ERROR')
    }
  }
}
