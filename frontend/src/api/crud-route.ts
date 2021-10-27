import { Entity } from '../store/entity'

/**
 * A REST route responsible for managing a specific type of entity via CRUD.
 */
export class CrudRoute<EntityType extends Entity> {
  constructor (
    private readonly collectionUrl: string
  ) {
  }

  /**
   * Obtain the entire list of entities.
   *
   * @returns A Promise that resolves with the collection when the request completes.
   */
  async list (): Promise<EntityType[]> {
    const response = await fetch(this.collectionUrl)
    if (!response.ok) {
      throw new Error('collection could not be retrieved')
    }
    return await response.json()
  }

  /**
   * Create a new entity. The entity will match the given specification, but it will have a
   * unique id set by the server (if an id is present on the provided specification,
   * it will be ignored).
   *
   * @param entity The entity specification.
   * @returns A Promise that resolves with the created entity when the request completes.
   */
  async create (entity: EntityType | Omit<EntityType, '_id'>): Promise<EntityType> {
    // send the entity, but without its _id field
    const data = { ...entity, _id: undefined }
    const response = await fetch(this.collectionUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('entity could not be created')
    }
    return await response.json()
  }

  /**
   * Update an existing entity. The full entity representation must be provided.
   *
   * @param entity The entity representation.
   * @returns A Promise that resolves with the modified entity when the request completes.
   */
  async update (entity: EntityType): Promise<EntityType> {
    const data = { ...entity, _id: undefined }
    const response = await fetch(this.collectionUrl + `/${entity._id}`, {
      method: 'PUT',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('entity could not be updated')
    }
    return await response.json()
  }

  /**
   * Delete an entity by id.
   *
   * @param id The entity id.
   * @returns A Promise that resolves when the request completes.
   */
  async delete (id: string): Promise<void> {
    const response = await fetch(this.collectionUrl + `/${id}`, {
      method: 'DELETE',
      cache: 'no-cache'
    })
    if (!response.ok) {
      throw new Error('entity could not be deleted')
    }
  }
}
