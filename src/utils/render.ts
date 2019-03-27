export default function render(h, parsed) {
  if (typeof parsed === 'string') return parsed

  return h(
    parsed[0],
    { attrs: parsed[1], pre: true },
    (parsed[2] || []).map(c => render(h, c))
  )
}
