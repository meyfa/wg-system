import { Controller } from './controller'
import { Member } from '../models/member'
import { Document, QueryCursor } from 'mongoose'
import { broadcast } from '../websocket/events'
import { Scoreboard, scoreboardModel, scoreboardValidator } from '../models/scoreboard'

export interface ScoreboardDependencies {
  member: Controller<Member>
}

export class ScoreboardController extends Controller<Scoreboard> {
  constructor (broadcastName: string, dependencies: ScoreboardDependencies) {
    super(scoreboardModel, scoreboardValidator, broadcastName)

    // remove scores for members when they are deleted
    dependencies.member.on('deleted', async (other) => {
      const cursor: QueryCursor<Document<any, any, Scoreboard>> = scoreboardModel.find({
        'scores.memberId': other._id
      }).cursor()
      await cursor.eachAsync(async (item) => {
        await item.updateOne({
          $pull: {
            scores: {
              memberId: other._id
            }
          }
        })
        const updated = await scoreboardModel.findById(item._id)
        broadcast('update/' + broadcastName, updated)
      })
    })
  }
}
