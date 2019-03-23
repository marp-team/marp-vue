import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export class Marp extends Vue {
  data() {
    return Object.freeze({})
  }

  render(h) {
    return <div>Hello!</div>
  }
}

export default Marp
