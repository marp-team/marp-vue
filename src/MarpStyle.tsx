import Vue from 'vue'

export default Vue.extend({
  functional: true,
  render: (h, { scopedSlots }) => <style>{scopedSlots.default({})}</style>,
})
