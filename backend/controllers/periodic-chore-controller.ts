import { Controller } from './controller'
import { PeriodicChore, periodicChoreModel, periodicChoreValidator } from '../models/periodic-chore'
import { Member } from '../models/member'
import { Document, QueryCursor } from 'mongoose'
import { broadcast } from '../websocket/events'

export interface PeriodicChoreDependencies {
  member: Controller<Member>
}

export class PeriodicChoreController extends Controller<PeriodicChore> {
  constructor (broadcastName: string, dependencies: PeriodicChoreDependencies) {
    super(periodicChoreModel, periodicChoreValidator, broadcastName)

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
        broadcast('update/' + broadcastName, updated)
      })
    })
  }
}
