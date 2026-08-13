import type { ProjectProgressEvent, PublicProjectProgress } from '@domain/project-tracking/models'

export interface ProjectProgressRepository {
  listPublished(): Promise<readonly PublicProjectProgress[]>
  getPublishedBySlug(slug: string): Promise<PublicProjectProgress | null>
}

export type Unsubscribe = () => void
export interface ProjectProgressSubscription {
  subscribe(projectId: string, onEvent: (event: ProjectProgressEvent) => void): Unsubscribe
}
