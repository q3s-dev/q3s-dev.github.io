import * as external from './external.js'

const { pako } = external
const { btoa, atob, URL, location, URLSearchParams } = window
const urlValidCharsSet = ".#=?/:,;@+!~*'()" + // available in URLSearchParams
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\-_' // base64url
const urlValidCharsRE = new RegExp(`^[${urlValidCharsSet}]*$`)


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


class DataURL {

  #url = null
  #application = ''
  #data = ''
  #encoded = ''

  get application() {
    return this.#application
  }

  set application(value) {
    value = String(value)
    if (urlValidCharsRE.test(value)) {
      this.#application = value
    }
  }

  get data() {
    return this.#data
  }

  set data(value) {
    this.#data = String(value)
    this.#encoded = this.#data ? deflate(this.#data) : ''
  }

  get encoded() {
    return this.#encoded
  }

  set encoded(value) {
    this.#encoded = String(value)
    this.#data = this.#encoded ? inflate(this.#encoded) : ''
  }

  get href() {
    this.#url.hash = new URLSearchParams([[this.#application, this.#encoded]])

    return this.#url.href
  }

  constructor(href = location.origin) {
    const url = new URL(href)

    this.#url = new URL(url.origin + url.pathname)

    if (url.hash) {
      const params = new URLSearchParams(url.hash.slice(1))

      for (const [application, encoded] of params.entries()) {
        if (urlValidCharsRE.test(application)) {
          this.application = application
          this.encoded = encoded
          break
        }
      }
    }
  }

}


export {
  deflate,
  inflate,
  DataURL
}
