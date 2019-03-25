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
    return { [containerClassSymbol]: this.$data.$_containerClass }
  },
})
export class Marp extends Vue {
  @Prop({ type: String }) markdown: string | undefined

  @Prop({ type: Object, default: () => ({}) }) options!: MarpOptions

  data() {
    const containerIdentifier = identifier()

    return Object.freeze({
      $_containerClass: `marp-${containerIdentifier}`,
    })
  }

  get $_componentStyle() {
    const { $_containerClass } = this.$data

    return [
      `div.${$_containerClass}{all:initial;}`,
      `div.${$_containerClass} > svg[data-marpit-svg]{display:block;will-change:transform;}`,
    ].join('\n')
  }

  get $_marp() {
    return new MarpCore({
      ...this.options,
      container: false,
      markdown: {
        ...(this.options.markdown || {}),
        xhtmlOut: true,
      },
      slideContainer: { tag: 'div', class: this.$data.$_containerClass },
    })
  }

  get $_rendered() {
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
          {this.$_rendered.css}
          {this.$_componentStyle}
        </marp-style>
        {(this.$scopedSlots.default || defaultRenderer)({
          slides: this.$_rendered.slides,
        })}
      </div>
    )
  }
}

export default Marp
