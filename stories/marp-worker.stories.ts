import { storiesOf } from '@storybook/vue'
import editor from './editor'
import MarpWorkerEntry from './marp.worker'
import { MarpWorker, MarpSlide } from '../src/index'

const components = { MarpWorker, MarpSlide }
const worker = new MarpWorkerEntry()

const largeMd = (baseMd: string) => {
  let markdown = `${baseMd}\n\n---\n<!-- _color: #ddd -->\n![bg](#f8f8f8)\n`

  for (let i = 0; i < 100; i += 1) markdown += '\n$y=ax^2+bx+c$'
  return markdown
}

storiesOf('MarpWorker', module)
  .add('Basic usage', () =>
    editor({
      components,
      props: {
        markdown: { default: () => '# Hello, world!' },
        worker: { default: () => worker },
      },
      template: '<MarpWorker :markdown="markdown" :worker="worker" />',
    })
  )
  .add('Large Markdown', () => {
    const markdown = largeMd(
      [
        '# Large Markdown',
        'This deck has 100 math typesettings, but it has not blocked UI by long-time conversion.',
        'Besides, it still keeps blazing-fast preview by frame-skipped rendering. Try typing fast! :zap:',
      ].join('\n\n')
    )
    return editor({
      components,
      props: {
        markdown: { default: () => markdown },
        worker: { default: () => worker },
      },
      template: '<MarpWorker :markdown="markdown" :worker="worker" />',
    })
  })
  .add('Custom renderer', () =>
    editor({
      components,
      props: {
        markdown: {
          default: () =>
            largeMd(
              '# Custom renderer\n\nMarpWorker can specify initial rendering state.'
            ),
        },
        worker: { default: () => worker },
      },
      template: `
        <MarpWorker :markdown="markdown" :worker="worker">
          <template #initial>
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
    })
  )
