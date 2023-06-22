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

  test('parses an ordered list with 1.', () => {
    expect(starkdown('1. One\n2. Two')).toEqual('<ol><li>One</li><li>Two</li></ol>')
  })

  test('parses an ordered list with 1)', () => {
    expect(starkdown('1) One\n2) Two')).toEqual('<ol><li>One</li><li>Two</li></ol>')
  })

  test('parses an ordered list — numbers are all 1', () => {
    expect(starkdown('1. Ordered\n1. Lists\n1. Numbers are ignored')).toEqual(
      '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })

  test('parses an ordered list — start at 5', () => {
    expect(starkdown('5) Ordered\n2) Lists\n4) Numbers are ignored')).toEqual(
      '<ol start="5"><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })

  test('does not parse incorrect unordered lists', () => {
    expect(starkdown('　- One\n　- Two')).toEqual('<p>- One\n　- Two</p>')
  })

  test('does not parse incorrect ordered lists', () => {
    expect(starkdown('(1) One\n(2) Two')).toEqual('<p>(1) One\n(2) Two</p>')
  })

  test('Double line break with a non-list node will split up a list - ul', () => {
    expect(starkdown('- One\n\nA\n\n- Two')).toEqual(
      '<ul><li>One</li></ul><p>A</p><ul><li>Two</li></ul>'
    )
  })

  test('Double line break with a non-list node will split up a list - ol', () => {
    expect(starkdown('1. One\n\nA\n\n2. Two')).toEqual(
      '<ol><li>One</li></ol><p>A</p><ol start="2"><li>Two</li></ol>'
    )
  })

  // test('Allows line breaking in lists — treat double line breaks as single in lists - ul', () => {
  //   expect(starkdown('- One\n\n- Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  // })

  // test('Allows line breaking in lists — treat double line breaks as single in lists - ol', () => {
  //   expect(starkdown('1. One\n\n2. Two')).toEqual('<ol><li>One</li><li>Two</li></ol>')
  // })

  // [FUTURE FEATURE?]
  // test('Allows line breaking in lists — treat double line breaks as single in lists & add `.wide` class - ul', () => {
  //   expect(starkdown('- One\n\n- Two')).toEqual('<ul class="wide"><li>One</li><li>Two</li></ul>')
  // })

  test('Allows line breaking in lists — default behaviour of single line breaks - ul', () => {
    expect(starkdown('- One\nA\nB\n- Two')).toEqual('<ul><li>One\nA\nB</li><li>Two</li></ul>')
  })

  test('Allows line breaking in lists — default behaviour of single line breaks - ol', () => {
    expect(starkdown('1. One\nA\nB\n2. Two')).toEqual('<ol><li>One\nA\nB</li><li>Two</li></ol>')
  })

  test('Allows line breaking in lists — up to 3 leading spaces on new line are ignored - ul', () => {
    expect(starkdown('- One\n  A\n   B\n- Two')).toEqual(
      '<ul><li>One\n  A\n   B</li><li>Two</li></ul>'
    )
  })

  test('Allows line breaking in lists — up to 3 leading spaces on new line are ignored - ol', () => {
    expect(starkdown('1. One\n  A\n   B\n2. Two')).toEqual(
      '<ol><li>One\n  A\n   B</li><li>Two</li></ol>'
    )
  })

  test('Allows line breaking in lists — Japanese spaces on new line are not ignored - ul', () => {
    expect(starkdown('- One\n　　A\n　　B\n- Two')).toEqual(
      '<ul><li>One\n　　A\n　　B</li><li>Two</li></ul>'
    )
  })

  test('Allows line breaking in lists — Japanese spaces on new line are not ignored - ol', () => {
    expect(starkdown('1. One\n　　A\n　　B\n2. Two')).toEqual(
      '<ol><li>One\n　　A\n　　B</li><li>Two</li></ol>'
    )
  })

  test('Allows line breaking in lists — force <br /> - ul', () => {
    expect(starkdown('- One  \nA  \nB\n- Two')).toEqual(
      '<ul><li>One<br />A<br />B</li><li>Two</li></ul>'
    )
  })

  test('Allows line breaking in lists — force <br /> - ol', () => {
    expect(starkdown('1. One  \nA  \nB\n2. Two')).toEqual(
      '<ol><li>One<br />A<br />B</li><li>Two</li></ol>'
    )
  })

  // Due to the way that we're dealing with newlines and paragraphs, this doesn't work at the moment but
  // keeping this here to make sure that we can just uncomment it in the future
  // test.only('parses an ordered list and adds paragraphs inbetween them if double spaced', () => {
  //   expect(starkdown('1) Ordered\n2) Lists\n\n4) Numbers are ignored')).toEqual(
  //     '<ol><li><p>Ordered<p></li><li><p>Lists<p></li><li><p>Numbers are ignored<p></li></ol>'
  //   )
  // })
})
