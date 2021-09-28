import { CrudRoute } from './crud-route'
import { Member } from '../store/entities/members'

/**
 * A client for the REST API, mainly making accessible CRUD operations for all entity types.
 */
export class Api {
  readonly members: CrudRoute<Member>

  constructor (
    private readonly baseUrl: string
  ) {
    this.members = new CrudRoute(baseUrl + 'members')
  }
}

const url = window.location.origin + '/api/'

const api = new Api(url)
export default api
