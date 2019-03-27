# @marp-team/marp-vue

[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg?sanitize=true)](https://marp-vue.netlify.com/)
[![CircleCI](https://img.shields.io/circleci/project/github/marp-team/marp-vue/master.svg?style=flat-square&logo=circleci)](https://circleci.com/gh/marp-team/marp-vue/)
[![Codecov](https://img.shields.io/codecov/c/github/marp-team/marp-vue/master.svg?style=flat-square&logo=codecov)](https://codecov.io/gh/marp-team/marp-vue)
[![npm](https://img.shields.io/npm/v/@marp-team/marp-vue.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/@marp-team/marp-vue)
[![LICENSE](https://img.shields.io/github/license/marp-team/marp-vue.svg?style=flat-square)](./LICENSE)

**[Marp](https://marp.app) renderer component for [Vue].**

### :warning: Currently Marp Vue is under developing and not ready to use.

[vue]: https://jp.vuejs.org/index.html

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
    <MarpRenderer :markdown="markdown">
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
<div id="app">
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

> We also provide `Marp` component and actually `MarpRenderer` is an alias to `Marp`. We recommend to use `MarpRenderer` becasue [the multi-word component name is an essential rule in Vue style guide.](https://vuejs.org/v2/style-guide/index.html#Multi-word-component-names-essential)

#### Constructor option

[Marp constructor options](https://github.com/marp-team/marp-core#constructor-options) can change in `options` prop.

```vue
<template>
  <div id="app">
    <MarpRenderer markdown=":+1:" :options="options">
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
