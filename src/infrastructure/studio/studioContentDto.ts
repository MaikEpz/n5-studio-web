import type { StudioContent } from '@domain/studio/models'

export type StudioContentDto = unknown

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')

export function mapStudioContentDto(dto: StudioContentDto): StudioContent {
  if (!isRecord(dto) || !isStringArray(dto.valueTypes) || !isStringArray(dto.creativeSystem) || !Array.isArray(dto.principles) || !Array.isArray(dto.divisions) || !isStringArray(dto.directionFocus) || !isStringArray(dto.manifesto)) {
    throw new Error('El contenido institucional recibido no cumple el contrato esperado')
  }

  return dto as StudioContent
}
