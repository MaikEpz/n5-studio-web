import type { ProjectProgressRepository, ProjectProgressSubscription } from './ports'

export const listPublishedProjects = (repository: ProjectProgressRepository) => repository.listPublished()
export const getPublishedProject = (repository: ProjectProgressRepository, slug: string) => repository.getPublishedBySlug(slug)
export const subscribeToProjectProgress = (subscription: ProjectProgressSubscription, projectId: string, onEvent: Parameters<ProjectProgressSubscription['subscribe']>[1]) => subscription.subscribe(projectId, onEvent)
