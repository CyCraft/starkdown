import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

describe('code & quotes', () => {
  test('parses inline code', () => {
    expect(starkdown('Here is some code `var a = 1`.')).toEqual(
      '<p>Here is some code <code>var a = 1</code>.</p>'
    )
  })

  test('escapes inline code', () => {
    expect(starkdown('a `<">` b')).toEqual('<p>a <code>&lt;&quot;&gt;</code> b</p>')
  })

  test('parses three backtricks (```) as a code block', () => {
    expect(starkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).toEqual(
      '<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )

    expect(
      starkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')
    ).toEqual(
      '<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )
  })

  test('parses tabs as a code poetry block', () => {
    expect(starkdown('\tvar a = 1')).toEqual(
      '<pre class="code poetry"><code>var a = 1</code></pre>'
    )
  })

  test('escapes code/quote blocks', () => {
    expect(starkdown('```\n<foo>\n```')).toEqual(
      '<pre class="code "><code>&lt;foo&gt;</code></pre>'
    )
    expect(starkdown('\t<foo>')).toEqual('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>')
  })

  test('parses a block quote', () => {
    expect(starkdown('> To be or not to be')).toEqual('<blockquote>To be or not to be</blockquote>')
  })

  test('parses lists within block quotes', () => {
    expect(starkdown('> - one\n> - two\n> - **three**')).toEqual(
      '<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>'
    )
  })

  test("won't make paragraphs in code blocks", () => {
    expect(
      starkdown('```\n\n\nfunction codeBlocks() {\n\n\treturn "Can be inserted";\n\n}\n\n```')
    ).toEqual(
      '<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )
  })
})