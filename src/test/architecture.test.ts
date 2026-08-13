import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const files = (directory: string): string[] => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name)
  return statSync(path).isDirectory() ? files(path) : path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : []
})

describe('clean architecture boundaries', () => {
  it('keeps domain independent from frameworks and outer layers', () => {
    for (const file of files(join(process.cwd(), 'src/domain'))) expect(readFileSync(file, 'utf8')).not.toMatch(/from ['"](?:react|gsap|lenis|@infrastructure|@features|@app)/)
  })
  it('keeps application independent from UI and infrastructure', () => {
    for (const file of files(join(process.cwd(), 'src/application'))) expect(readFileSync(file, 'utf8')).not.toMatch(/from ['"](?:react|gsap|lenis|@infrastructure|@features|@app)/)
  })
})
