export default function hBridge(h: Function) {
  // Create bridge to createElement method for React
  return (element: string | Function, attrs: object, ...rest: any[]) =>
    h(element, { attrs }, rest)
}
