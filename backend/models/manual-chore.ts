import mongoose, { Schema } from 'mongoose'

export interface ManualChore {
  name: string
  dueSince: number
}

export default mongoose.model('ManualChore', new Schema<ManualChore>({
  name: {
    type: String,
    required: true
  },
  dueSince: {
    type: Number,
    required: true,
    min: 0
  }
}))
