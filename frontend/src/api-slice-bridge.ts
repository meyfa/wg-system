import { Entity } from './store/entity'
import { useCallback, useEffect } from 'react'
import { EntitySliceActions } from './store/create-entity-slice'
import { useAppDispatch } from './store/store'
import { MessageEvent, socket } from './websocket/socket'
import { CrudRoute } from './api/crud-route'
import { useConnectionStatus } from './hooks/use-connection-status'

function useEntityFetch<T extends Entity> (sliceActions: EntitySliceActions<T>, crud: CrudRoute<T>): void {
  const dispatch = useAppDispatch()

  // using this as a dependency ensures that the list is re-queried when the socket reconnects
  // (otherwise modifications made between disconnect and reconnect might get lost)
  const connected: boolean = useConnectionStatus()

  useEffect(() => {
    if (!connected) {
      // if there is no socket connection, we very likely cannot retrieve the entity list either
      return
    }
    const fetchEntities = async (): Promise<void> => {
      const initial = await crud.list()
      dispatch(sliceActions.setEntities(initial))
    }
    fetchEntities().catch((err: unknown) => console.error(err))
  }, [dispatch, sliceActions, crud, connected])
}

function useEntitySocketEvents<T extends Entity> (sliceActions: EntitySliceActions<T>, type: string): void {
  const dispatch = useAppDispatch()

  const listener = useCallback((event: MessageEvent): void => {
    const msg = event.data
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
    socket.addEventListener('message', listener)
    return () => {
      socket.removeEventListener('message', listener)
    }
  }, [listener, sliceActions])
}

export function useApiSliceBridge<T extends Entity> (sliceActions: EntitySliceActions<T>, type: string, crud: CrudRoute<T>): void {
  useEntityFetch(sliceActions, crud)
  useEntitySocketEvents(sliceActions, type)
}
