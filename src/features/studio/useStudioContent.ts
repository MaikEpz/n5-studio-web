import { useEffect, useState } from 'react'
import type { AsyncState } from '@application/shared/asyncState'
import type { StudioContentRepository } from '@application/studio/StudioContentRepository'
import { loadStudioContent } from '@application/studio/loadStudioContent'
import type { StudioContent } from '@domain/studio/models'

export function useStudioContent(repository: StudioContentRepository) {
  const [state, setState] = useState<AsyncState<StudioContent>>({ status: 'idle' })
  useEffect(() => {
    let current = true
    setState({ status: 'loading' })
    loadStudioContent(repository).then(
      (data) => current && setState({ status: 'success', data }),
      (reason: unknown) => current && setState({ status: 'error', error: reason instanceof Error ? reason : new Error('No fue posible cargar el contenido') }),
    )
    return () => { current = false }
  }, [repository])
  return state
}
