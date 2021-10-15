import { CrudRoute } from './crud-route'
import { Group } from '../store/entities/groups'
import { Member } from '../store/entities/members'
import { ManualChore } from '../store/entities/manual-chores'
import { Scoreboard } from '../store/entities/scoreboards'
import { PeriodicChore } from '../store/entities/periodic-chores'

/**
 * A client for the REST API, mainly making accessible CRUD operations for all entity types.
 */
export class Api {
  readonly groups: CrudRoute<Group>
  readonly members: CrudRoute<Member>
  readonly manualChores: CrudRoute<ManualChore>
  readonly scoreboards: CrudRoute<Scoreboard>
  readonly periodicChores: CrudRoute<PeriodicChore>

  constructor (
    private readonly baseUrl: string
  ) {
    this.groups = new CrudRoute(baseUrl + 'groups')
    this.members = new CrudRoute(baseUrl + 'members')
    this.manualChores = new CrudRoute(baseUrl + 'manual-chores')
    this.scoreboards = new CrudRoute(baseUrl + 'scoreboards')
    this.periodicChores = new CrudRoute(baseUrl + 'periodic-chores')
  }
}

const url = window.location.origin + '/api/'

const api = new Api(url)
export default api
