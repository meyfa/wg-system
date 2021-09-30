import { Document, Model, Types } from 'mongoose'
import Joi, { ObjectSchema } from 'joi'
import { BadRequestError, NotFoundError } from '../api/errors'
import { broadcast } from '../websocket/events'

export class Controller<EntityType> {
  private readonly model: Model<EntityType>
  private readonly schema: ObjectSchema
  private readonly broadcastName: string

  constructor (model: Model<EntityType>, schema: ObjectSchema, broadcastName: string) {
    this.model = model
    // use a modified schema that removes the id to avoid problems during create/update
    this.schema = schema.fork('_id', () => Joi.any().strip())
    this.broadcastName = broadcastName
  }

  private validate (data: any): Omit<EntityType, '_id'> {
    const { value, error } = this.schema.validate(data)
    if (error != null) {
      throw new BadRequestError(error.message)
    }
    return value
  }

  async list (): Promise<Array<Document<EntityType>>> {
    return await this.model.find()
  }

  async find (id: string): Promise<Document<EntityType>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.model.findById(id)
    if (item == null) {
      throw new NotFoundError()
    }
    return item
  }

  async create (data: any): Promise<Document<EntityType>> {
    const value = this.validate(data)
    const item = await this.model.create(value)
    broadcast('add/' + this.broadcastName, item)
    return item
  }

  async update (id: string, data: any): Promise<Document<EntityType>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.find(id)
    Object.assign(item, this.validate(data))
    const saved = await item.save()
    broadcast('update/' + this.broadcastName, saved)
    return saved
  }

  async delete (id: string): Promise<Document<EntityType>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.model.findByIdAndDelete(id)
    if (item == null) {
      throw new NotFoundError()
    }
    broadcast('remove/' + this.broadcastName, item)
    return item
  }
}
