import mongoose, { HydratedDocument, Model } from 'mongoose'
import Joi, { ObjectSchema } from 'joi'
import { BadRequestError, NotFoundError } from '../api/errors.js'
import { TypedEmitter } from 'tiny-typed-emitter'

export type Doc<EntityType> = HydratedDocument<EntityType>

export type ControllerListener<EntityType> = (item: Doc<EntityType>) => any

export interface ControllerEvents<EntityType> {
  created: ControllerListener<EntityType>
  updated: ControllerListener<EntityType>
  deleted: ControllerListener<EntityType>
}

export class Controller<EntityType> extends TypedEmitter<ControllerEvents<EntityType>> {
  protected readonly model: Model<EntityType>
  private readonly schema: ObjectSchema

  constructor (model: Model<EntityType>, schema: ObjectSchema) {
    super()
    this.model = model
    // use a modified schema that removes the id to avoid problems during create/update
    this.schema = schema.fork('_id', () => Joi.any().strip())
  }

  private validate (data: any): Omit<EntityType, '_id'> {
    const { value, error } = this.schema.validate(data)
    if (error != null) {
      throw new BadRequestError(error.message)
    }
    return value
  }

  async list (): Promise<Array<Doc<EntityType>>> {
    return await this.model.find()
  }

  async find (id: string): Promise<Doc<EntityType>> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.model.findById(id)
    if (item == null) {
      throw new NotFoundError()
    }
    return item
  }

  async create (data: any): Promise<Doc<EntityType>> {
    const value = this.validate(data)
    const item = await this.model.create(value)
    this.emit('created', item)
    return item
  }

  async update (id: string, data: any): Promise<Doc<EntityType>> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.find(id)
    item.set(this.validate(data))
    await item.save()
    this.emit('updated', item)
    return item
  }

  async delete (id: string): Promise<Doc<EntityType>> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError()
    }
    const item = await this.model.findByIdAndDelete(id)
    if (item == null) {
      throw new NotFoundError()
    }
    this.emit('deleted', item)
    return item
  }
}
