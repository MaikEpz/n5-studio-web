export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed'
export type MilestoneStatus = 'pending' | 'active' | 'completed'

export type ProjectMilestone = { id: string; name: string; status: MilestoneStatus; progress: number; startsAt?: string; dueAt?: string }
export type ProjectDeliverable = { id: string; name: string; mediaType: string; version: string; available: boolean }
export type ProjectUpdate = { id: string; revision: number; occurredAt: string; summary: string }

export type PublicProjectProgress = {
  id: string
  slug: string
  name: string
  status: ProjectStatus
  progress: number
  currentPhase: string
  milestones: readonly ProjectMilestone[]
  deliverables: readonly ProjectDeliverable[]
  timeline: readonly ProjectUpdate[]
  revision: number
  syncedAt: string
  published: true
}

export type ProjectProgressEvent = { projectId: string; revision: number; occurredAt: string; snapshot: PublicProjectProgress }

export const shouldApplyProjectEvent = (currentRevision: number, incomingRevision: number) => incomingRevision > currentRevision
