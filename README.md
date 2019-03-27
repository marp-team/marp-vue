# @marp-team/marp-vue

[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg?sanitize=true)](https://marp-vue.netlify.com/)
[![CircleCI](https://img.shields.io/circleci/project/github/marp-team/marp-vue/master.svg?style=flat-square&logo=circleci)](https://circleci.com/gh/marp-team/marp-vue/)
[![Codecov](https://img.shields.io/codecov/c/github/marp-team/marp-vue/master.svg?style=flat-square&logo=codecov)](https://codecov.io/gh/marp-team/marp-vue)
[![npm](https://img.shields.io/npm/v/@marp-team/marp-vue.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/@marp-team/marp-vue)
[![LICENSE](https://img.shields.io/github/license/marp-team/marp-vue.svg?style=flat-square)](./LICENSE)

**[Marp](https://marp.app) renderer component for [Vue].**

[vue]: https://vuejs.org/index.html

## Before using Marp Vue

This component is suited to create presentation tools integrated with Marp by Vue. Marp would create the static slide contents consist of plain HTML and CSS, so you have to notice that **it's not suited to control the content of your slide by Vue**.

**[Eagle.js]** framework is a good choice to create beautiful slide contents with making full use of Vue power. If you really think to need, you can even use Marp Vue in that frameworks.

[eagle.js]: https://github.com/zulko/eagle.js/

## Install

```bash
# yarn
yarn add @marp-team/marp-core @marp-team/marp-vue

# npm
npm install --save @marp-team/marp-core @marp-team/marp-vue
```

## Usage

### Marp renderer component

This is a simple usage of Marp renderer component. It renders slides via [inline SVG](https://marpit.marp.app/inline-svg) to `<div>` elements.

```vue
<template>
  <div id="app">
    <MarpRenderer :markdown="markdown" />
  </div>
</template>

<script>
import { MarpRenderer } from '@marp-team/marp-vue'

const markdown = `
# Page 1

---

## Page 2`

export default {
  components: { MarpRenderer },
  data: () => ({ markdown }),
}
</script>
```

```html
<div>
  <div class="marp-xxxxxxxx">
    <svg data-marpit-svg viewBox="0 0 1280 960">
      <foreignObject width="1280" height="960">
        <section><h1>Page 1</h1></section>
      </foreignObject>
    </svg>
  </div>
  <div class="marp-xxxxxxxx">
    <svg data-marpit-svg viewBox="0 0 1280 960">
      <foreignObject width="1280" height="960">
        <section><h2>Page 2</h2></section>
      </foreignObject>
    </svg>
  </div>
</div>
```

> We also provide [`Marp`](./src/Marp.tsx) component and actually `MarpRenderer` is an alias to `Marp`. We recommend to use `MarpRenderer` becasue [the multi-word component name is an essential rule in Vue style guide.](https://vuejs.org/v2/style-guide/index.html#Multi-word-component-names-essential)

#### Constructor option

[Marp constructor options](https://github.com/marp-team/marp-core#constructor-options) can change in `options` prop.

```vue
<template>
  <div id="app">
    <MarpRenderer markdown=":+1:" :options="options" />
  </div>
</template>

<script>
import { MarpRenderer } from '@marp-team/marp-vue'

const options = {
  inlineSVG: false,
  emoji: {
    shortcode: true,
    unicode: true,
  },
}

export default {
  components: { MarpRenderer },
  data: () => ({ options }),
}
</script>
```

#### Custom renderer

You can use a custom renderer by passing slot content to children. [`MarpSlide`](./src/MarpSlide.tsx) component is required to render slides provided by slot props.

```vue
<template>
  <div id="app">
    <MarpRenderer :markdown="markdown" v-slot="slides">
      <div class="slide" v-for="(s, i) in slides" :key="i">
        <MarpSlide :slide="s.slide" />
        <p v-for="(comment, i) in s.comments" v-text="comment" :key="i" />
      </div>
    </MarpRenderer>
  </div>
</template>

<script>
import { MarpRenderer, MarpSlide } from '@marp-team/marp-vue'

const markdown = '# :a: <!-- A -->\n\n---\n\n# :b: <!-- B -->'

export default {
  components: { MarpRenderer, MarpSlide },
  data: () => ({ markdown }),
}
</script>
```

> :information_source: See also [Scoped Slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) in the document of Vue.

### `MarpWorker` component _(Experimental)_

For the best performance of the integrated web app, `MarpWorker` component allows using [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for Markdown conversion. It has a lot of clear advantages over a regular `MarpRenderer` component.

- It does not block UI thread while converting large Markdown.
- A blazing fast live preview by a simple but clever queueing system is available.
- No longer need to include a huge Marp Core into main JS.
- Web Worker will be loaded asynchronously, so the first paint will not block.

The renderer using worker may be default component of Marp Vue in future.

#### Basic usage

You can use it just by swapping from `MarpRenderer` to `MarpWorker`. By default, `MarpWorker` will use a pre-built worker via [jsDelivr](https://www.jsdelivr.com/) CDN.

```vue
<template>
  <div id="app">
    <MarpWorker markdown="# Hello, Marp Worker!" />
  </div>
</template>

<script>
import { MarpWorker } from '@marp-team/marp-vue'

export default { components: { MarpWorker } }
</script>
```

#### Use custom worker

The custom worker may specify via `worker` prop.

```vue
<template>
  <div id="app">
    <MarpWorker :worker="worker" markdown="# Hello, Marp Worker!" />
  </div>
</template>

<script>
import { MarpWorker } from '@marp-team/marp-vue'

export default {
  components: { MarpWorker },
  data: () => ({
    worker: new Worker('worker.js'),
  }),
}
</script>
```

```javascript
// worker.js
require('@marp-team/marp-vue/lib/worker')()
```

#### Initial rendering

`MarpWorker`'s custom renderer might be called with `undefined` slides argument, unlike `Marp`. It means an initial rendering of the component while preparing worker.

You may show waiting user a loading message as follows:

```html
<MarpWorker markdown="# Hello, Marp Worker!" v-slot="slides">
  <div class="marp" v-if="slides">
    <div class="slide" v-for="(s, i) in slides" :key="i">
      <MarpSlide :slide="s.slide" />
    </div>
  </div>
  <p v-else>
    Loading Marp Worker...
  </p>
</MarpWorker>
```

Or `initial` [named slot](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) allows showing individually defined template while loading worker:

```html
<MarpWorker markdown="# Hello, Marp Worker!">
  <template #initial>
    <p>Loading...</p>
  </template>

  <template #default="slides">
    <div class="slide" v-for="(s, i) in slides" :key="i">
      <MarpSlide :slide="s.slide" />
    </div>
  </template>
</MarpWorker>
```

## ToDo

- [x] Implement Vue renderer component based on [our prototype](https://codesandbox.io/s/2x994l3roj)
- [x] Support rendering in worker
  - [x] Allow using worker via CDN (`importScript()`)
  - [x] Use worker hosted on CDN by default
- [ ] Support additional theme(s)
- [ ] Support swapping engine (e.g. [Marpit](https://github.com/marp-team/marpit))

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
