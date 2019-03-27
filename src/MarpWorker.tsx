import { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpBase from './MarpBase'
import bridge from './utils/bridge'
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
  watch: {
    markdown(this: MarpWorker) {
      this.$_updateMarkdown()
    },
    options(this: MarpWorker) {
      this.$_updateMarkdown()
    },
  },
})
export class MarpWorker extends MarpBase {
  @Prop({
    default: CDNWorker,
    validator: obj => {
      const { Worker } = window as any
      return obj && (Worker ? obj instanceof Worker : true)
    },
  })
  worker!: Worker

  private $_marpWorker_destructor: Function | undefined

  data() {
    return {
      $_marpWorker_rendered: undefined,
      $_marpWorker_queue: false,
    }
  }

  mounted() {
    this.$_marpWorker_destructor = listen(
      this.worker,
      {
        rendered: rendered => {
          this.$data.$_marpWorker_rendered = Object.freeze({
            css: rendered.css,
            slides: rendered.slides.map((h, i) => ({
              slide: h,
              comments: rendered.comments[i],
            })),
          })

          const { $_marp_container: c, $_marpWorker_queue: q } = this.$data

          if (q !== false && q !== true) {
            send(this.worker, c.class, 'render', q[0], q[1])
            this.$data.$_marpWorker_queue = true
          } else {
            this.$data.$_marpWorker_queue = false
          }
        },
      },
      this.$data.$_marp_container.class
    )

    this.$_updateMarkdown()
  }

  destroyed() {
    if (this.$_marpWorker_destructor) this.$_marpWorker_destructor()
  }

  render(createElement: CreateElement): VNode {
    const h = bridge(createElement)
    const defaultRenderer = slides =>
      slides
        ? slides.map(({ slide }) => <marp-slide slide={slide} />)
        : undefined

    const { $_marpWorker_rendered: rendered } = this.$data

    return (
      <div>
        {rendered && h('style', {}, rendered.css, this.$_marp_style)}
        {((!rendered && this.$scopedSlots.initial) ||
          this.$scopedSlots.default ||
          defaultRenderer)((rendered || {}).slides)}
      </div>
    )
  }

  private $_updateMarkdown() {
    if (this.$data.$_marpWorker_queue) {
      this.$data.$_marpWorker_queue = [this.markdown || '', this.$_marp_options]
    } else {
      this.$data.$_marpWorker_queue = true
      send(
        this.worker,
        this.$data.$_marp_container.class,
        'render',
        this.markdown || '',
        this.$_marp_options
      )
    }
  }
}

export default MarpWorker
