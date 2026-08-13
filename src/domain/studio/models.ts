export type Principle = {
  title: string
  body: readonly string[]
  bullets?: readonly string[]
  path?: readonly string[]
}

export type DivisionId = 'rrss' | 'labs' | 'cine'

export type Division = {
  id: DivisionId
  number: string
  name: string
  label: string
  image: string
  alt: string
  intro: readonly string[]
  capabilities?: readonly string[]
  mission: string
  objective: string
  outcomes?: readonly string[]
  indicators: readonly string[]
}

export type StudioContent = {
  valueTypes: readonly string[]
  creativeSystem: readonly string[]
  principles: readonly Principle[]
  divisions: readonly Division[]
  directionFocus: readonly string[]
  manifesto: readonly string[]
}
