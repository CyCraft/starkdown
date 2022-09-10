# Starkdown 🦾

<a href="https://www.npmjs.com/package/starkdown"><img src="https://img.shields.io/npm/v/starkdown.svg" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/starkdown"><img src="https://img.shields.io/npm/dw/starkdown.svg" alt="Latest Stable Version"></a>

Starkdown is a Tiny <2kb Markdown parser written, almost as fast and smart as Tony Stark.

```sh
npm i starkdown
```

## Motivation

It is a continuation on [Snarkdown](https://github.com/developit/snarkdown), which had stopped development at 1kb, but doesn't include support for paragraphs, tables and fenced divs.

Starkdown adds these additional enhancements:

- [Paragraphs](#paragraphs)
- [Tables](#tables)
- [Fenced Divs](#fenced-divs)

## Usage

Starkdown is really easy to use, a single function which parses a string of Markdown and returns a String of HTML. Couldn't be simpler.

```js
import { starkdown } from 'starkdown';

const md = '_This_ is **easy** to `use`.';
const html = starkdown(md);
console.log(html);
```

Your html looks like
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
[github](https://github.com)

![](/some-image.png)
```

converts to

```html
<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" /></p>
```

But also, when just using images and links:

```md
[github](https://github.com)

![](/some-image.png)
```

converts to

```html
<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" /></p>
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
<div class="fenced ">this is some info</div>
```

**Or with a custom class.**

```md
::: info
this is some info
:::
```

converts to

```html
<div class="fenced info">this is some info</div>
```

---

<p align="center">
  <img src="https://cdn.jsdelivr.net/emojione/assets/svg/1f63c.svg" width="256" height="256" alt="Snarkdown">
</p>
<h1 align="center">
  Snarkdown
  <a href="https://www.npmjs.org/package/snarkdown">
    <img src="https://img.shields.io/npm/v/snarkdown.svg?style=flat" alt="npm">
  </a>
</h1>

Snarkdown is a dead simple **1kb** [Markdown] parser.

It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.


## Features

- **Fast:** since it's basically one regex and a huge if statement
- **Tiny:** it's 1kb of gzipped ES3
- **Simple:** pass a Markdown string, get back an HTML string

> **Note:** Tables are not yet supported. If you love impossible to read regular expressions, submit a PR!
>
> **Note on XSS:** Snarkdown [doesn't sanitize HTML](https://github.com/developit/snarkdown/issues/70), since its primary target usage doesn't require it.

## Demos & Examples

- ⚛️ [**Snarky**](https://snarky.surge.sh) - markdown editor built with Preact & Snarkdown
- ✏️ [**Simple Markdown Editor**](http://jsfiddle.net/developit/828w6t1x/)


## Usage

Snarkdown exports a single function, which parses a string of Markdown and returns a String of HTML. Couldn't be simpler.

The snarkdown module is available in [every module format](https://unpkg.com/snarkdown/dist/) you'd ever need: ES Modules, CommonJS, UMD...

```js
import snarkdown from 'snarkdown';

let md = '_this_ is **easy** to `use`.';
let html = snarkdown(md);
console.log(html);
// <em>this</em> is <strong>easy</strong> to <code>use</code>.
```

### Add-ons and Libraries

- For Webpack users, [`snarkdown-loader`](https://github.com/Plugin-contrib/snarkdown-loader) renders markdown files to html.



[Markdown]: http://daringfireball.net/projects/markdown/
