export default function render(h, parsed) {
  if (typeof parsed === 'string') return parsed

  // TODO: Ignore rendering MathML elements (Vue is not following expected <math>)
  return h(
    parsed[0],
    { attrs: parsed[1] },
    (parsed[2] || []).map(c => render(h, c))
  )
}
