import type { StudioContent } from '@domain/studio/models'

export interface StudioContentRepository {
  getPublished(): Promise<StudioContent>
}
