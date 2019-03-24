export default function render(h, parsed) {
  return typeof parsed === 'string'
    ? parsed
    : h(
        parsed[0],
        { attrs: parsed[1] },
        (parsed[2] || []).map(c => render(h, c))
      )
}
