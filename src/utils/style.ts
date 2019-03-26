export default function style(container: string) {
  return `
div.${container}{all:initial;}
div.${container} > svg[data-marpit-svg]{display:block;will-change:transform;}
  `.trim()
}
