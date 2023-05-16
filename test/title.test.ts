import { expect, describe, test } from 'vitest'
import { starkdown } from '../src'

describe('titles', () => {
  test('parses H1 titles', () => {
    expect(starkdown('# I like tiny libraries')).toEqual('<h1>I like tiny libraries</h1>')
  })

  test('parses underlined H1 titles', () => {
    expect(starkdown('I like tiny libraries\n===')).toEqual('<h1>I like tiny libraries</h1>')
  })

  test('parses H2 titles', () => {
    expect(starkdown('## I like tiny libraries')).toEqual('<h2>I like tiny libraries</h2>')
  })

  test('parses H3 titles', () => {
    expect(starkdown('### I like tiny libraries')).toEqual('<h3>I like tiny libraries</h3>')
  })

  test('parses H4 titles', () => {
    expect(starkdown('#### I like tiny libraries')).toEqual('<h4>I like tiny libraries</h4>')
  })

  test('parses H5 titles', () => {
    expect(starkdown('##### I like tiny libraries')).toEqual('<h5>I like tiny libraries</h5>')
  })

  test('parses H6 titles', () => {
    expect(starkdown('###### I like tiny libraries')).toEqual('<h6>I like tiny libraries</h6>')
  })
})
