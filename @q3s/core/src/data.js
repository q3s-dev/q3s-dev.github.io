import * as external from './external.js'

const { pako } = external
const { btoa, atob } = window


/** @type {import('__data__').deflate} */
function deflate(text) {
  const rawData = pako.deflateRaw(text)
  let chars = ''

  for (let i = 0; i < rawData.length; i++) {
    chars += String.fromCharCode(rawData[i])
  }

  const base64url = btoa(chars)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_')

  return base64url
}

/** @type {import('__data__').inflate} */
function inflate(base64url) {
  const chars = atob(base64url
    .replaceAll('-', '+')
    .replaceAll('_', '/'))
  const rawData = []

  for (let i = 0; i < chars.length; i++) {
    rawData.push(chars.charCodeAt(i))
  }

  /** @type {string} */// @ts-ignore
  const text = pako.inflateRaw(rawData, { to: 'string' })

  return text
}


export {
  deflate,
  inflate
}