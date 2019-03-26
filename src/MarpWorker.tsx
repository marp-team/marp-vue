import { MarpOptions } from '@marp-team/marp-core'
import MarpReady from '@marp-team/marp-core/lib/browser.cjs'
import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpSlide from './MarpSlide'
import bridge from './utils/bridge'
import identifier from './utils/identifier'
import style from './utils/style'
import { containerSymbol } from './utils/symbol'
import { listen, send } from './utils/worker'

let memoizedCDNWorker: Worker | undefined

const CDNWorker = () => {
  if (!memoizedCDNWorker) {
    const script =
      "self.importScripts('https://cdn.jsdelivr.net/npm/@marp-team/marp-vue/dist/worker.js')"
    const blob = new Blob([script], { type: 'text/javascript' })

    memoizedCDNWorker = new Worker(URL.createObjectURL(blob), {})
  }
  return memoizedCDNWorker
}

@Component({
  components: { MarpSlide },
  provide() {
    return { [containerSymbol]: this.$data.$_marpworker_container.class }
  },
  watch: {
    markdown(this: MarpWorker) {
      this.$_updateMarkdown()
    },
    options(this: MarpWorker) {
      this.$_updateMarkdown()
    },
  },
})
export class MarpWorker extends Vue {
  @Prop({ type: String }) markdown: string | undefined

  @Prop({ type: Object, default: () => ({}) }) options!: MarpOptions

  @Prop({
    default: CDNWorker,
    validator: obj => {
      const { Worker } = window as any
      return obj && (Worker ? obj instanceof Worker : true)
    },
  })
  worker!: Worker

  data() {
    const containerIdentifier = identifier()

    return {
      $_marpworker_container: Object.freeze({
        class: `marp-${containerIdentifier}`,
      }),
      $_marpworker_rendered: undefined,
      $_marpworker_queue: false,
    }
  }

  get $_marpworker_style() {
    return style(this.$data.$_marpworker_container.class)
  }

  get $_marpworker_options(): MarpOptions {
    return {
      ...this.options,
      container: false,
      markdown: {
        ...(this.options.markdown || {}),
        xhtmlOut: true,
      },
      slideContainer: {
        tag: 'div',
        class: this.$data.$_marpworker_container.class,
      },
    }
  }

  mounted(this: any) {
    MarpReady()

    listen(
      this.worker,
      {
        rendered: rendered => {
          this.$data.$_marpworker_rendered = Object.freeze({
            css: rendered.css,
            slides: rendered.slides.map((h, i) => ({
              slide: h,
              comments: rendered.comments[i],
            })),
          })

          const {
            $_marpworker_container: c,
            $_marpworker_queue: q,
          } = this.$data

          if (q !== false && q !== true) {
            send(this.worker, c.class, 'render', q[0], q[1])
            this.$data.$_marpworker_queue = true
          } else {
            this.$data.$_marpworker_queue = false
          }
        },
      },
      this.$data.$_marpworker_container.class
    )

    this.$_updateMarkdown()
  }

  render(createElement: CreateElement): VNode {
    const h = bridge(createElement)
    const defaultRenderer = rendered =>
      rendered && Object.keys(rendered).length > 0
        ? rendered.slides.map(({ slide }) => <marp-slide slide={slide} />)
        : undefined

    const { $_marpworker_rendered: rendered } = this.$data

    return (
      <div>
        {rendered && h('style', {}, rendered.css, this.$_marpworker_style)}
        {((!rendered && this.$scopedSlots.initial) ||
          this.$scopedSlots.default ||
          defaultRenderer)(rendered)}
      </div>
    )
  }

  private $_updateMarkdown() {
    if (this.$data.$_marpworker_queue) {
      this.$data.$_marpworker_queue = [
        this.markdown || '',
        this.$_marpworker_options,
      ]
    } else {
      this.$data.$_marpworker_queue = true
      send(
        this.worker,
        this.$data.$_marpworker_container.class,
        'render',
        this.markdown || '',
        this.$_marpworker_options
      )
    }
  }
}

export default MarpWorker
