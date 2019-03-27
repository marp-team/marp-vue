import { Marp as MarpCore } from '@marp-team/marp-core'
import { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import MarpBase from './MarpBase'
import bridge from './utils/bridge'
import parse from './utils/parse'

@Component
export class Marp extends MarpBase {
  get $_marp_core() {
    return new MarpCore(this.$_marp_options)
  }

  get $_marp_rendered() {
    const { html, css, comments } = this.$_marp_core.render(
      this.markdown || '',
      { htmlAsArray: true }
    )

    return {
      css,
      slides: html.map((h, i) => ({ slide: parse(h), comments: comments[i] })),
    }
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
