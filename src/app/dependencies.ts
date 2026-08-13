import { LocalStudioContentRepository } from '@infrastructure/studio/LocalStudioContentRepository'

export const dependencies = {
  studioContentRepository: new LocalStudioContentRepository(),
} as const
