import type { StudioContentRepository } from '@application/studio/StudioContentRepository'
import type { StudioContent } from '@domain/studio/models'
import { creativeSystem, directionFocus, divisions, manifesto, principles, valueTypes } from './localContent'

export class LocalStudioContentRepository implements StudioContentRepository {
  async getPublished(): Promise<StudioContent> {
    return { valueTypes, creativeSystem, principles, divisions, directionFocus, manifesto }
  }
}
