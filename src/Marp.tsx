import { Marp as MarpCore, MarpOptions } from '@marp-team/marp-core'
import Vue from 'vue'
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
    return { [containerClassSymbol]: this.$data.containerClass }
  },
})
export class Marp extends Vue {
  @Prop({ type: String }) markdown: string | undefined

  @Prop({ type: Object, default: () => ({}) }) options!: MarpOptions

  data() {
    const containerIdentifier = identifier()

    return Object.freeze({
      containerClass: `marp-${containerIdentifier}`,
      styleId: `marp-class-${containerIdentifier}`,
    })
  }

  get componentStyle() {
    const { containerClass } = this.$data

    return [
      `div.${containerClass}{all:initial;}`,
      `div.${containerClass} > svg[data-marpit-svg]{display:block;will-change:transform;}`,
    ].join('\n')
  }

  get marp() {
    return new MarpCore({
      ...this.options,
      container: false,
      markdown: {
        ...(this.options.markdown || {}),
        xhtmlOut: true,
      },
      slideContainer: { tag: 'div', class: this.$data.containerClass },
    })
  }

  get rendered() {
    const { html, css, comments } = this.marp.render(this.markdown || '', {
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

  render(createElement) {
    const h = bridge(createElement)
    const defaultRenderer = ({ slides }) =>
      slides.map(({ slide }) => <marp-slide slide={slide} />)

    return (
      <div>
        <marp-style>
          {this.rendered.css}
          {this.componentStyle}
        </marp-style>
        {(this.$scopedSlots.default || defaultRenderer)({
          slides: this.rendered.slides,
        })}
      </div>
    )
  }
}

export default Marp
