import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import bridge from './utils/bridge'
import render from './utils/render'
import { containerSymbol } from './utils/symbol'

@Component
export class MarpSlide extends Vue {
  @Prop({ type: Array, required: true }) slide!: any[]

  @Inject(containerSymbol) readonly $_container!: string

  render(createElement: CreateElement): VNode {
    const h = bridge(createElement)

    return (
      <div class={this.$_container}>{render(createElement, this.slide)}</div>
    )
  }
}

export default MarpSlide
