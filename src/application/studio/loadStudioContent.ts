import type { StudioContentRepository } from './StudioContentRepository'

export const loadStudioContent = (repository: StudioContentRepository) =>
  repository.getPublished()
