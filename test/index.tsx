import { mount } from '@vue/test-utils'
import EventEmitter from 'events'
import { Marp, MarpWorker } from '../src/index'
import bridge from '../src/utils/bridge'
import initializeWorker from '../src/worker'

interface WorkerMock extends Worker, EventEmitter {
  interrupt: (state?: boolean) => void
  postQueue: jest.Mock
  queue: any[]
}

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

  it('injects style for rendering Marp slide', () => {
    const { element } = mount(Marp)
    expect(element.querySelector('style')).toBeTruthy()
  })

  describe('Custom renderer', () => {
    const markdown = '<!--comment-->'
    const renderer = jest.fn(function customRenderer(this: any) {
      const h = bridge(this.$createElement)
      return <p>rendered</p>
    })

    it('allows custom renderer passed by children', () => {
      const marp = mount(Marp, {
        propsData: { markdown },
        scopedSlots: { default: renderer },
      })

      expect(marp.element.querySelector('p')!.textContent).toBe('rendered')
      expect(renderer).toBeCalledWith([
        expect.objectContaining({
          slide: expect.anything(),
          comments: ['comment'],
        }),
      ])
    })
  })
})

describe('MarpWorker', () => {
  const Worker = jest.fn(() => {
    const wk: any = new EventEmitter()

    Object.assign(wk, {
      // Queueing for test
      queue: [],
      interrupted: false,
      interrupt: (state = true) => {
        if (!state) while (wk.queue.length > 0) wk.postQueue(wk.queue.shift())
        wk.interrupted = state
      },

      // Event emitter functions
      addEventListener: (e, listener) => wk.addListener(e, listener),
      removeEventListener: (e, listener) => wk.removeListener(e, listener),
      postMessage: m => (wk.interrupted ? wk.queue.push(m) : wk.postQueue(m)),
      postQueue: jest.fn(data => wk.emit('message', { data })),
    })

    initializeWorker(wk)
    return wk as WorkerMock
  })

  it('renders passed Markdown', () => {
    const marp = mount(MarpWorker, {
      propsData: { worker: new Worker(), markdown: '# Test' },
    })
    expect(marp.element.querySelectorAll('section > h1')).toHaveLength(1)

    // Track change of markdown prop
    marp.setProps({ markdown: '## Hello' })

    expect(marp.element.querySelectorAll('section > h1')).toHaveLength(0)
    expect(marp.element.querySelectorAll('section > h2')).toHaveLength(1)
  })

  it('removes listener for worker when unmounted', () => {
    const worker = new Worker()
    const marp = mount(MarpWorker, { propsData: { worker } })

    expect(worker.listeners('message')).toHaveLength(2) // Worker + component

    marp.destroy()
    expect(worker.listeners('message')).toHaveLength(1) // component only
  })

  it('queues new rendering while converting', () => {
    const worker = new Worker()
    const marp = mount(MarpWorker, { propsData: { worker } })

    worker.interrupt()
    marp.setProps({ markdown: '1' })
    marp.setProps({ markdown: '2' })
    marp.setProps({ markdown: '3' })
    expect(worker.queue).toHaveLength(1)

    worker.interrupt(false)
    expect(marp.element.querySelector('p')!.textContent).toBe('3')

    // 2nd rendering will be skipped
    expect(worker.postQueue).not.toBeCalledWith(expect.arrayContaining(['2']))
  })
})
