import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProcessFlow } from './ProcessFlow'

const steps = [
  { title: 'Entender', body: 'a' },
  { title: 'Crear', body: 'b' },
  { title: 'Producir', body: 'c' },
  { title: 'Finalizar', body: 'd' },
]

let notify: (visible: boolean) => void = () => {}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) { notify = (visible) => callback([{ isIntersecting: visible }]) }
    observe() {}
    disconnect() {}
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// Cada fase programa la siguiente al volver a renderizar, así que se avanza de una en una.
const advancePhases = (count: number) => { for (let i = 0; i < count; i++) act(() => { vi.advanceTimersByTime(2400) }) }
const stepStates =(container: HTMLElement) => [...container.querySelectorAll('.rrss-flow-steps li')].map((li) => li.className.split(' ')[0])
const nodeStates = (container: HTMLElement) => [...container.querySelectorAll('.rrss-node')].map((node) => node.getAttribute('class')?.split(' ')[1])

describe('ProcessFlow', () => {
  it('recorre las fases al entrar en pantalla, completa la entrega y reinicia al salir', () => {
    const { container } = render(<ProcessFlow steps={steps} />)
    expect(stepStates(container)).toEqual(['is-pending', 'is-pending', 'is-pending', 'is-pending'])

    act(() => notify(true))
    act(() => { vi.advanceTimersByTime(350) })
    expect(stepStates(container)).toEqual(['is-active', 'is-pending', 'is-pending', 'is-pending'])
    expect(container.querySelector('[aria-current="step"] h3')).toHaveTextContent('Entender')

    advancePhases(2)
    expect(stepStates(container)).toEqual(['is-done', 'is-done', 'is-active', 'is-pending'])

    advancePhases(2)
    expect(stepStates(container)).toEqual(['is-done', 'is-done', 'is-done', 'is-done'])
    expect(nodeStates(container).at(-1)).toBe('is-active')

    // Al reiniciar pasa por un estado vacío para que las conexiones se vuelvan a trazar.
    act(() => { vi.advanceTimersByTime(2200) })
    expect(stepStates(container)).toEqual(['is-pending', 'is-pending', 'is-pending', 'is-pending'])
    act(() => { vi.advanceTimersByTime(350) })
    expect(stepStates(container)).toEqual(['is-active', 'is-pending', 'is-pending', 'is-pending'])

    act(() => notify(false))
    expect(stepStates(container)).toEqual(['is-pending', 'is-pending', 'is-pending', 'is-pending'])
  })
})
