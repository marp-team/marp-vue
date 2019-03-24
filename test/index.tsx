import { mount } from '@vue/test-utils'
import { Marp } from '../src/index'

describe('Marp', () => {
  it('renders passed Markdown', () => {
    const marp = mount(Marp, {
      propsData: { markdown: '# Hello' },
    })
    expect(marp.element.querySelectorAll('section > h1')).toHaveLength(1)

    const markdown = `
---
theme: gaia
class: lead
---

![bg](bg.png)

# Marp Markdown
    `.trim()

    marp.setProps({ markdown })
    expect(marp.element.querySelector('section.lead')).toBeTruthy()
    expect(marp.element.querySelectorAll('figure')).toHaveLength(1)
  })

  it('renders highlighted fence correctly', () => {
    const markdown = `
\`\`\`js
test({
  foo: 0,
  bar: 1,
});
\`\`\`
`.trim()

    const marp = mount(Marp, { propsData: { markdown } })
    expect(marp.text().trim()).toContain(
      `
test({
  foo: 0,
  bar: 1,
});
`.trim()
    )
  })
})
