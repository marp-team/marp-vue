import { Marp as MarpCore, MarpOptions } from '@marp-team/marp-core'
import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpSlide from './MarpSlide'
import bridge from './utils/bridge'
import identifier from './utils/identifier'
import parse from './utils/parse'
import style from './utils/style'
import { containerSymbol } from './utils/symbol'

@Component({
  components: { MarpSlide },
  provide() {
    return { [containerSymbol]: this.$data.$_marp_container }
  },
})
export class Marp extends Vue {
  @Prop({ type: String }) markdown: string | undefined

  @Prop({ type: Object, default: () => ({}) }) options!: MarpOptions

  data() {
    const containerIdentifier = identifier()

    return Object.freeze({
      $_marp_container: `marp-${containerIdentifier}`,
    })
  }

  get $_marp() {
    return new MarpCore({
      ...this.options,
      container: false,
      markdown: {
        ...(this.options.markdown || {}),
        xhtmlOut: true,
      },
      slideContainer: { tag: 'div', class: this.$data.$_marp_container },
    })
  }

  get $_marp_style() {
    return style(this.$data.$_marp_container)
  }

  get $_marp_rendered() {
    const { html, css, comments } = this.$_marp.render(this.markdown || '', {
      htmlAsArray: true,
    })

    return {
      css,
      slides: html.map((h, i) => ({ slide: parse(h), comments: comments[i] })),
    }
  }

  mounted() {
    MarpCore.ready()
  }

  render(createElement: CreateElement): VNode {
    const h = bridge(createElement)
    const defaultRenderer = ({ slides }) =>
      slides.map(({ slide }) => <marp-slide slide={slide} />)

    return (
      <div>
        {h('style', {}, this.$_marp_rendered.css, this.$_marp_style)}
        {(this.$scopedSlots.default || defaultRenderer)({
          slides: this.$_marp_rendered.slides,
        })}
      </div>
    )
  }
}

export default Marp
