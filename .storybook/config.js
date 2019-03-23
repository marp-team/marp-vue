import { configure } from '@storybook/vue'

const req = require.context('../stories', true, /.stories.[jt]sx?$/)

configure(() => req.keys().forEach(fn => req(fn)), module)
