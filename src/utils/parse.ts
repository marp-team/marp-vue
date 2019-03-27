import { decode } from 'he'
import htm from 'htm'

const decodeEntities = <V>(v: V, isAttributeValue = false) =>
  typeof v === 'string' ? decode(v, { isAttributeValue }) : v

const html = htm.bind((type: string, props, ...children) => {
  const attrs = { ...props }

  // Decode HTML entities in arguments
  Object.keys(attrs).forEach(p => {
    attrs[p] = decodeEntities(attrs[p], true)
  })

  return [type, attrs, children.map(c => decodeEntities(c))]
})

export default function parse(htmlStr: string) {
  const lines = htmlStr.trim().split('\n')
  const breaks = [...Array(lines.length - 1)].map(() => '\n')

  return html(lines, ...breaks)
}
