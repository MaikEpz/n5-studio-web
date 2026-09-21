import { describe, expect, it } from 'vitest'
import { LocalStudioContentRepository } from './LocalStudioContentRepository'

describe('LocalStudioContentRepository', () => {
  it('exposes the complete published institutional model', async () => {
    const content = await new LocalStudioContentRepository().getPublished()
    expect(content.divisions.map(({ id }) => id)).toEqual(['rrss', 'labs', 'cine'])
    expect(content.principles).toHaveLength(8)
    expect(content.manifesto).toHaveLength(4)
  })
})
