import { Base } from '@fightron/utils/Base'

export class BaseInjector extends Base {
  constructor (client) {
    super()
    this.client = client
  }
}
