import { expect, describe, test } from 'vitest'
import { starkdown } from '../src'

describe('html', () => {
  test('should not parse a block tag', () => {
    expect(starkdown(`<div title="I **don't** parse"></div>`)).toEqual(
      `<div title="I **don't** parse"></div>`
    )
  })
  test('should add a <p> around an anchor tag', () => {
    expect(starkdown('<a class="_b" target="_blank">a</a>')).toEqual(
      '<p><a class="_b" target="_blank">a</a></p>'
    )
  })

  test('should parse outside HTML tags', () => {
    expect(starkdown('<a>**a**</a>')).toEqual('<p><a><strong>a</strong></a></p>')
    expect(starkdown('<a> **a** </a>')).toEqual('<p><a> <strong>a</strong> </a></p>')
  })
})
