import { CrudRoute } from './crud-route'
import { Member } from '../store/entities/members'
import { ManualChore } from '../store/entities/manual-chores'

/**
 * A client for the REST API, mainly making accessible CRUD operations for all entity types.
 */
export class Api {
  readonly members: CrudRoute<Member>
  readonly manualChores: CrudRoute<ManualChore>

  constructor (
    private readonly baseUrl: string
  ) {
    this.members = new CrudRoute(baseUrl + 'members')
    this.manualChores = new CrudRoute(baseUrl + 'manual-chores')
  }
}

const url = window.location.origin + '/api/'

const api = new Api(url)
export default api
