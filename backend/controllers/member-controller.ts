import { Controller, Doc } from './controller.js'
import { Member, memberModel, memberValidator } from '../models/member.js'
import mongoose, { QueryCursor } from 'mongoose'
import { Group } from '../models/group.js'

function removeObjectId<T extends mongoose.Types.ObjectId> (ids: readonly T[], remove: T): T[] {
  // this is to avoid a linter error, because for some reason typescript-eslint thinks that
  // id.equals does not result in a boolean if its parameter is of type 'any', which,
  // again for some reason unknown to me, other._id seems to be (Mongoose, what did you do?)
  return ids.filter(id => !id.equals(remove))
}

export interface MemberDependencies {
  group: Controller<Group>
}

export class MemberController extends Controller<Member> {
  constructor (dependencies: MemberDependencies) {
    super(memberModel, memberValidator)

    // remove groups for members when they are deleted
    dependencies.group.on('deleted', async (other) => {
      const cursor: QueryCursor<Doc<Member>> = memberModel.find({
        groups: other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        item.groups = removeObjectId(item.groups, other._id)
        await item.save()
        this.emit('updated', item)
      })
    })
  }
}
