import { addParameters, configure } from '@storybook/vue'

addParameters({ options: { showPanel: false } })

const req = require.context('../stories', true, /.stories.[jt]sx?$/)

configure(() => req.keys().forEach(fn => req(fn)), module)
