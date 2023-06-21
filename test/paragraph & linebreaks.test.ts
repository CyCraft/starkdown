import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

describe('paragraphs', () => {
  test('creates single paragraphs', () => {
    expect(starkdown('Here is a single Paragraph')).toEqual('<p>Here is a single Paragraph</p>')

    expect(starkdown('Here is a\n single Paragraph')).toEqual('<p>Here is a\n single Paragraph</p>')
  })

  test('parses two new lines as separate paragraphs', () => {
    expect(starkdown('Something with\n\na line break')).toEqual(
      '<p>Something with</p><p>a line break</p>'
    )

    expect(starkdown('Here...\n\n\n are...\n\nthree \n\nno, 4 Paragraphs!')).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no, 4 Paragraphs!</p>'
    )

    expect(
      starkdown(
        '\nHere...\n\n\n \nare...\n\nthree\n \n\nno,\n 4 Paragraphs!\nshould not delete single linebreaks'
      )
    ).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no,\n 4 Paragraphs!\nshould not delete single linebreaks</p>'
    )
  })

  test('parses two spaces plus line break as <br />', () => {
    expect(starkdown('Something with  \na line break')).toEqual(
      '<p>Something with<br />a line break</p>'
    )
    expect(starkdown('Something with \na line break')).toEqual(
      '<p>Something with \na line break</p>'
    )
  })

  test('parses <br /> as <br />', () => {
    expect(starkdown('Something with<br />a line break')).toEqual(
      '<p>Something with<br />a line break</p>'
    )
    expect(starkdown('Something with<br/>a line break')).toEqual(
      '<p>Something with<br/>a line break</p>'
    )
    expect(starkdown('Something with<br>a line break')).toEqual(
      '<p>Something with<br>a line break</p>'
    )
  })
})
