import { Marp as MarpCore, MarpOptions } from '@marp-team/marp-core'
import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpSlide from './MarpSlide'
import MarpStyle from './MarpStyle'
import bridge from './utils/bridge'
import identifier from './utils/identifier'
import parse from './utils/parse'
import { containerClassSymbol } from './utils/symbol'

@Component({
  components: { MarpSlide, MarpStyle },
  provide() {
    return { [containerClassSymbol]: this.$data.$_marp_containerClass }
  },
})
export class Marp extends Vue {
  @Prop({ type: String }) markdown: string | undefined

  @Prop({ type: Object, default: () => ({}) }) options!: MarpOptions

  data() {
    const containerIdentifier = identifier()

    return Object.freeze({
      $_marp_containerClass: `marp-${containerIdentifier}`,
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
      slideContainer: { tag: 'div', class: this.$data.$_marp_containerClass },
    })
  }

  get $_marp_componentStyle() {
    const { $_marp_containerClass: container } = this.$data

    return [
      `div.${container}{all:initial;}`,
      `div.${container} > svg[data-marpit-svg]{display:block;will-change:transform;}`,
    ].join('\n')
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
        <marp-style>
          {this.$_marp_rendered.css}
          {this.$_marp_componentStyle}
        </marp-style>
        {(this.$scopedSlots.default || defaultRenderer)({
          slides: this.$_marp_rendered.slides,
        })}
      </div>
    )
  }
}

export default Marp
