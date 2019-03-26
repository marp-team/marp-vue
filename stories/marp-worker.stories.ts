import { withKnobs, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/vue'
import MarpWorkerEntry from './marp.worker'
import { MarpWorker, MarpSlide } from '../src/index'

const worker = new MarpWorkerEntry()

const components = { MarpWorker, MarpSlide }

storiesOf('MarpWorker', module)
  .addDecorator(withKnobs({ escapeHTML: false, debounce: false }))
  .add('Basic usage', () => ({
    components,
    props: {
      markdown: {
        default: text('Markdown', '# Hello, world!'),
      },
      worker: { default: () => worker },
    },
    template: '<MarpWorker :markdown="markdown" :worker="worker" />',
  }))
  .add('Custom renderer', () => ({
    components,
    props: {
      markdown: {
        default: text(
          'Markdown',
          '# Page 1\n\n<!-- Comment (for presenter notes) -->\n\n---\n\n![bg](#fff8f0)\n\n# Page 2'
        ),
      },
      worker: { default: () => worker },
    },
    template: `
      <MarpWorker :markdown="markdown" :worker="worker">
        <template #loading>
          <p>Loading...</p>
        </template>
        <template v-slot="{ slides }">
          <div :style="{ margin: '40px' }" v-for="s in slides">
            <div :style="{ boxShadow: '0 5px 10px #ccc' }">
              <MarpSlide :slide="s.slide" />
            </div>
            <p v-for="comment in s.comments" v-text="comment" />
          </div>
        </template>
      </MarpWorker>
    `,
  }))
  .add('Multiple components', () => ({
    components,
    props: {
      markdownLeft: { default: text('Markdown (Left)', '# Left') },
      markdownRight: { default: text('Markdown (Right)', '# Right') },
      worker: { default: () => worker },
    },
    template: `
      <div style="display:flex;">
        <MarpWorker style="flex:1;" :markdown="markdownLeft" :worker="worker" />
        <MarpWorker style="flex:1;" :markdown="markdownRight" :worker="worker" />
      </div>
    `,
  }))
