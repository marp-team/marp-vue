import { storiesOf } from '@storybook/vue'
import { MarpRenderer } from '../src/index'

storiesOf('Marp', module).add('Basic usage', () => ({
  components: { MarpRenderer },
  template: '<marp-renderer markdown="# Hello, world!"></marp-renderer>',
}))
