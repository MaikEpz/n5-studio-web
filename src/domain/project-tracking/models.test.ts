import { describe, expect, it } from 'vitest'
import { shouldApplyProjectEvent } from './models'

describe('project progress revisions', () => {
  it('accepts only newer events', () => {
    expect(shouldApplyProjectEvent(4, 5)).toBe(true)
    expect(shouldApplyProjectEvent(5, 5)).toBe(false)
    expect(shouldApplyProjectEvent(6, 5)).toBe(false)
  })
})
