import { MarpOptions } from '@marp-team/marp-core'
import MarpReady from '@marp-team/marp-core/lib/browser.cjs'
import nanoid from 'nanoid/generate'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import MarpSlide from './MarpSlide'
import { containerSymbol } from './utils/symbol'

const identifierChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const identifier = (): string => nanoid(identifierChars, 8)

@Component({
  components: { MarpSlide },
  provide() {
    return { [containerSymbol]: this.$data.$_marp_container.class }
  },
})
export default class MarpBase extends Vue {
  @Prop({ type: String })
  markdown: string | undefined

  @Prop({ type: Object, default: (): MarpOptions => ({}) })
  options!: MarpOptions

  data(): Record<string, any> {
    return {
      $_marp_container: Object.freeze({ class: `marp-${identifier()}` }),
    }
  }

  get $_marp_options(): MarpOptions {
    return {
      ...this.options,
      container: false,
      markdown: {
        ...(this.options.markdown || {}),
        xhtmlOut: true,
      },
      slideContainer: {
        tag: 'div',
        class: this.$data.$_marp_container.class,
      },
    }
  }

  get $_marp_style(): string {
    return `
div.${this.$data.$_marp_container.class}{all:initial;}
div.${this.$data.$_marp_container.class} > svg[data-marpit-svg]{display:block;will-change:transform;}
    `.trim()
  }

  mounted() {
    MarpReady()
  }
}
