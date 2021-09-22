import { Entity } from './store/entity'
import { useCallback, useEffect } from 'react'
import { EntitySliceActions } from './store/create-entity-slice'
import { useAppDispatch } from './store/store'
import socket, { EVENT_MESSAGE, Message } from './websocket/socket'

async function fetchEntityCollection<T extends Entity> (type: string): Promise<T[]> {
  const response = await fetch(`/api/${type}`)
  if (!response.ok) {
    throw new Error('error fetching collection: ' + type)
  }
  const { data } = await response.json()
  return data
}

function useEntityFetch<T extends Entity> (type: string, sliceActions: EntitySliceActions<T>): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchEntities = async (): Promise<void> => {
      const initial = await fetchEntityCollection<T>(type)
      dispatch(sliceActions.setEntities(initial))
    }
    fetchEntities().catch(console.error)
  }, [dispatch, type, sliceActions])
}

function useEntitySocketEvents<T extends Entity> (type: string, sliceActions: EntitySliceActions<T>): void {
  const dispatch = useAppDispatch()

  const listener = useCallback((msg: Message): void => {
    switch (msg.event) {
      case `add/${type}`:
        dispatch(sliceActions.createEntity(msg.data))
        break
      case `update/${type}`:
        dispatch(sliceActions.updateEntity(msg.data))
        break
      case `remove/${type}`:
        dispatch(sliceActions.deleteEntity(msg.data._id))
        break
    }
  }, [type, dispatch, sliceActions])

  useEffect(() => {
    socket.on(EVENT_MESSAGE, listener)
    return () => {
      socket.off(EVENT_MESSAGE, listener)
    }
  }, [listener, sliceActions])
}

export function useApiSliceBridge<T extends Entity> (type: string, sliceActions: EntitySliceActions<T>): void {
  useEntityFetch(type, sliceActions)
  useEntitySocketEvents(type, sliceActions)
}
