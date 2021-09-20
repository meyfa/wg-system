import mongoose, { Schema } from 'mongoose'

export interface Person {
  name: string
}

export default mongoose.model('Person', new Schema<Person>({
  name: {
    type: String,
    required: true
  }
}))
