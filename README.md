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

<!--

## Install

```bash
# yarn
yarn add @marp-team/marp-core @marp-team/marp-vue

# npm
npm install --save @marp-team/marp-core @marp-team/marp-vue
```

## Usage

UNDER CONSTRUCTION

-->

## ToDo

- [x] Implement Vue renderer component based on [our prototype](https://codesandbox.io/s/2x994l3roj)
- [ ] Support rendering in worker
  - [ ] Allow using worker via CDN (`importScript()`)
  - [ ] Use worker hosted on CDN by default
- [ ] Support additional theme(s)
- [ ] Support swapping engine (e.g. [Marpit](https://github.com/marp-team/marpit))

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
