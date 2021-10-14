import { Controller } from './controller'
import { PeriodicChore, periodicChoreModel, periodicChoreValidator } from '../models/periodic-chore'
import { Member } from '../models/member'
import { Document, QueryCursor } from 'mongoose'

export interface PeriodicChoreDependencies {
  member: Controller<Member>
}

export class PeriodicChoreController extends Controller<PeriodicChore> {
  constructor (dependencies: PeriodicChoreDependencies) {
    super(periodicChoreModel, periodicChoreValidator)

    // remove entries for members when they are deleted
    dependencies.member.on('deleted', async (other) => {
      const cursor: QueryCursor<Document<any, any, PeriodicChore>> = periodicChoreModel.find({
        'entries.memberId': other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        await item.updateOne({
          $pull: {
            entries: {
              memberId: other._id
            }
          }
        })
        const updated = await periodicChoreModel.findById(item._id)
        this.emit('updated', updated)
      })
    })
  }
}
