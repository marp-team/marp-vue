import { MarpOptions } from '@marp-team/marp-core'
import MarpReady from '@marp-team/marp-core/lib/browser.cjs'
import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpSlide from './MarpSlide'
import bridge from './utils/bridge'
import identifier from './utils/identifier'
import { containerClassSymbol } from './utils/symbol'
import { send, listen } from './utils/worker'

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
    return { [containerClassSymbol]: this.$data.$_marpworker_container.class }
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

  @Prop({ type: Worker, default: CDNWorker }) worker!: Worker

  data() {
    const containerIdentifier = identifier()

    return {
      $_marpworker_container: Object.freeze({
        class: `marp-${containerIdentifier}`,
      }),
      $_marpworker_rendered: undefined,
    }
  }

  get $_marpOptions(): MarpOptions {
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

    listen(this.worker, {
      rendered: rendered => {
        this.$data.$_marpworker_rendered = Object.freeze({
          css: rendered.css,
          slides: rendered.slides.map((h, i) => ({
            slide: h,
            comments: rendered.comments[i],
          })),
        })
      },
    })

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
        {rendered && h('style', {}, rendered.css)}
        {((!rendered && this.$scopedSlots.loading) ||
          this.$scopedSlots.default ||
          defaultRenderer)(rendered)}
      </div>
    )
  }

  private $_updateMarkdown() {
    send(this.worker, 'render', this.markdown || '', this.$_marpOptions)
  }
}

export default MarpWorker
