# Starkdown 🦾

<a href="https://www.npmjs.com/package/starkdown"><img src="https://img.shields.io/npm/v/starkdown.svg" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/starkdown"><img src="https://img.shields.io/npm/dw/starkdown.svg" alt="Latest Stable Version"></a>

Starkdown is a Tiny <2kb Markdown parser written, almost as fast and smart as Tony Stark.

```sh
npm i starkdown
```

## Motivation

It is a continuation on a similar package called [Snarkdown](https://github.com/developit/snarkdown), which had stopped development at 1kb, but doesn't include basic support for paragraphs, tables, fenced divs, etc.

Starkdown stays around 1.6kb and adds these additional enhancements:

- [Paragraphs](#paragraphs)
- [Tables](#tables)
- [Fenced Divs](#fenced-divs)
- [Formating done Right](#formating-done-right)

## Usage

Starkdown is really easy to use, a single function which parses a string of Markdown and returns a String of HTML. Couldn't be simpler.

```js
import { starkdown } from 'starkdown'

const md = '_This_ is **easy** to `use`.'
const html = starkdown(md)
console.log(html)
```

The html returned will look like:

```html
<p><em>This</em> is <strong>easy</strong> to <code>use</code>.</p>
```

### Paragraphs

With most Markdown implementations, paragraphs are wrapped in `<p>` tags. With Starkdown, this is no different. 

- All paragraphs and "inline" elements are wrapped in a `<p>` tags
(See [List of "inline" elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#list_of_inline_elements) on MDN)
  - Eg. a standalone image will still be wrapped in a `<p>` tag, because it's an inline element.
- All non-inline elements will not be wrapped in `<p>` tags
  - Eg. a table will not be wrapped in a `<p>` tag.

```md
Check [github](https://github.com)

Img: ![](/some-image.png)
```

converts to

```html
<p>Check <a href="https://github.com">github</a></p><p>Img: <img src="/some-image.png" alt="" /></p>
```

But also, when _just_ using images and links:

```md
[github](https://github.com)

![](/some-image.png)
```

converts to

```html
<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" alt="" /></p>
```

In contrast, non-inline elements won't get a `<p>` tag:

```md
### Usage

\`\`\`js
const a = 1
\`\`\`
```

converts to

```html
<h3>Usage</h3><pre class="code js"><code class="language-js">const a = 1</code></pre>
```

### Tables

```md
| My | Table |
```

converts to

```html
<table><tr><td>My</td><td>Table</td></tr></table>
```

### Fenced Divs

```md
:::
this is some info
:::
```

converts to

```html
<div class="fenced "><p>this is some info</p></div>
```

**Or with a custom class.**

```md
::: info
this is some info
:::
```

converts to

```html
<div class="fenced info"><p>this is some info</p></div>
```

### Formating done Right

You need to pad your formatting with spaces in order to correctly convert sentences like these:

```md
snake_case is _so-so_
```

correctly converts to

```html
<!-- in this library -->
<p>snake_case is <em>so-so</em></p>

<!-- but in Snarkdown... -->
snake<em>case is </em>so-so<em></em>
```

I have greatly simplified the complex logic of Snarkdown and fixed formatting issues like these.

## Security

**Note on XSS:** Starkdown doesn't sanitize HTML. Please bring your own HTML sanitation for any place where user input will be converted into HTML.
