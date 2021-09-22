import mongoose, { Schema } from 'mongoose'

export interface Member {
  name: string
}

export default mongoose.model('Member', new Schema<Member>({
  name: {
    type: String,
    required: true
  }
}))
