import { Controller } from './controller'
import { Member, memberModel, memberValidator } from '../models/member'
import { EnforceDocument, QueryCursor } from 'mongoose'
import { Group } from '../models/group'

export interface MemberDependencies {
  group: Controller<Group>
}

export class MemberController extends Controller<Member> {
  constructor (dependencies: MemberDependencies) {
    super(memberModel, memberValidator)

    // remove groups for members when they are deleted
    dependencies.group.on('deleted', async (other) => {
      const cursor: QueryCursor<EnforceDocument<Member, {}>> = memberModel.find({
        groups: other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        item.groups = item.groups.filter(id => !id.equals(other._id))
        await item.save()
        this.emit('updated', item)
      })
    })
  }
}
