import { storiesOf } from '@storybook/vue'
import editor from './editor'
import { MarpRenderer, MarpSlide } from '../src/index'

const components = { MarpRenderer, MarpSlide }

storiesOf('Marp', module)
  .add('Basic usage', () =>
    editor({
      components,
      props: { markdown: { default: () => '# Hello, world!' } },
      template: '<MarpRenderer :markdown="markdown" />',
    })
  )
  .add('Multiple slides', () =>
    editor({
      components,
      props: { markdown: { default: () => '# Page 1\n\n---\n\n# Page 2' } },
      template: '<MarpRenderer :markdown="markdown" />',
    })
  )
  .add('Theme support', () =>
    editor({
      components,
      props: {
        markdown: { default: () => '<!-- theme: gaia -->\n\n# Theme support' },
      },
      template: '<MarpRenderer :markdown="markdown" />',
    })
  )
  .add('Custom renderer', () =>
    editor({
      components,
      props: {
        markdown: {
          default: () =>
            '# Page 1\n\n<!-- Comment (for presenter notes) -->\n\n---\n\n![bg](#fff8f0)\n\n# Page 2',
        },
      },
      template: `
        <MarpRenderer :markdown="markdown" v-slot="slides">
          <div style="margin:40px;" v-for="s in slides">
            <div style="box-shadow:0 5px 10px #ccc;">
              <MarpSlide :slide="s.slide" />
            </div>
            <p v-for="comment in s.comments" v-text="comment" />
          </div>
        </MarpRenderer>
      `,
    })
  )
