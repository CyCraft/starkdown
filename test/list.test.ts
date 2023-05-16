import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

describe('lists', () => {
  test('parses an unordered list with *', () => {
    expect(starkdown('* One\n* Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with -', () => {
    expect(starkdown('- One\n- Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with +', () => {
    expect(starkdown('+ One\n+ Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with mixed bullet point styles', () => {
    expect(starkdown('+ One\n* Two\n- Three')).toEqual(
      '<ul><li>One</li><li>Two</li><li>Three</li></ul>'
    )
  })

  test('parses an ordered list', () => {
    expect(starkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).toEqual(
      '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })
})
