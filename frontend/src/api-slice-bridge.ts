import { Entity } from './store/entity'
import { useCallback, useEffect } from 'react'
import { EntitySliceActions } from './store/create-entity-slice'
import { useAppDispatch } from './store/store'
import socket, { EVENT_MESSAGE, Message } from './websocket/socket'
import { CrudRoute } from './api/crud-route'

function useEntityFetch<T extends Entity> (sliceActions: EntitySliceActions<T>, crud: CrudRoute<T>): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchEntities = async (): Promise<void> => {
      const initial = await crud.list()
      dispatch(sliceActions.setEntities(initial))
    }
    fetchEntities().catch(console.error)
  }, [dispatch, sliceActions, crud])
}

function useEntitySocketEvents<T extends Entity> (sliceActions: EntitySliceActions<T>, type: string): void {
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

export function useApiSliceBridge<T extends Entity> (sliceActions: EntitySliceActions<T>, type: string, crud: CrudRoute<T>): void {
  useEntityFetch(sliceActions, crud)
  useEntitySocketEvents(sliceActions, type)
}
