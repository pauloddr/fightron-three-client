import { Base } from '@fightron/core/lib/Base'

export class BaseInjector extends Base {
  constructor (client) {
    super()
    this.client = client
  }
}
