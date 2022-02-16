import { Controller, Doc } from './controller.js'
import {
  PERIODIC_CHORE_MODEL_NAME,
  PeriodicChore,
  periodicChoreSchema,
  periodicChoreValidator
} from '../models/periodic-chore.js'
import { Member } from '../models/member.js'
import mongoose, { QueryCursor } from 'mongoose'

export interface PeriodicChoreDependencies {
  member: Controller<Member>
}

export class PeriodicChoreController extends Controller<PeriodicChore> {
  constructor (db: mongoose.Connection, dependencies: PeriodicChoreDependencies) {
    super(db.model(PERIODIC_CHORE_MODEL_NAME, periodicChoreSchema), periodicChoreValidator)

    // remove entries for members when they are deleted
    dependencies.member.on('deleted', async (other) => {
      const cursor: QueryCursor<Doc<PeriodicChore>> = this.model.find({
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
        const updated = await this.model.findById(item._id)
        if (updated != null) {
          this.emit('updated', updated)
        }
      })
    })
  }
}
