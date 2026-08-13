import { describe, expect, it } from 'vitest'
import { mapStudioContentDto } from './studioContentDto'

describe('studio content DTO mapper', () => {
  it('rejects malformed remote payloads', () => expect(() => mapStudioContentDto({ divisions: [] })).toThrow(/contrato esperado/))
  it('accepts the required top-level shape', () => {
    const result = mapStudioContentDto({ valueTypes: [], creativeSystem: [], principles: [], divisions: [], directionFocus: [], manifesto: [] })
    expect(result.divisions).toEqual([])
  })
})
