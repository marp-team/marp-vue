import { CreateElement, VNodeChildren, VNodeData } from 'vue'

export default function hBridge(h: CreateElement) {
  // Create bridge to createElement method for React
  return (
    tag: string | Function,
    attrs: VNodeData['attrs'],
    ...rest: VNodeChildren[]
  ) => h(tag, { attrs }, rest)
}
