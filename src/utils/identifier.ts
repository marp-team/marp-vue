import nanoid from 'nanoid/generate'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function identifier(): string {
  return nanoid(chars, 8)
}
