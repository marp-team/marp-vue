import { withKnobs, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/vue'
import { MarpRenderer, MarpSlide } from '../src/index'

const components = { MarpRenderer, MarpSlide }

storiesOf('Marp', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Basic usage', () => ({
    components,
    props: { markdown: { default: text('Markdown', '# Hello, world!') } },
    template: '<MarpRenderer :markdown="markdown" />',
  }))
  .add('Multiple slides', () => ({
    components,
    props: {
      markdown: { default: text('Markdown', '# Page 1\n\n---\n\n# Page 2') },
    },
    template: '<MarpRenderer :markdown="markdown" />',
  }))
  .add('Theme support', () => ({
    components,
    props: {
      markdown: {
        default: text('Markdown', '<!-- theme: gaia -->\n\n# Theme support'),
      },
    },
    template: '<MarpRenderer :markdown="markdown" />',
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
    },
    template: `
      <MarpRenderer :markdown="markdown" v-slot="{ slides }">
        <div :style="{ margin: '40px' }" v-for="s in slides">
          <div :style="{ boxShadow: '0 5px 10px #ccc' }">
            <MarpSlide :slide="s.slide" />
          </div>
          <p v-for="comment in s.comments" v-text="comment" />
        </div>
      </Marp>
    `,
  }))
  .add('Multiple components', () => ({
    components,
    props: {
      markdownLeft: { default: text('Markdown (Left)', '# Left') },
      markdownRight: { default: text('Markdown (Right)', '# Right') },
    },
    template: `
      <div :style="{ display: 'flex' }">
        <MarpRenderer :style="{ flex: 1 }" :markdown="markdownLeft" />
        <MarpRenderer :style="{ flex: 1 }" :markdown="markdownRight" />
      </div>
    `,
  }))
