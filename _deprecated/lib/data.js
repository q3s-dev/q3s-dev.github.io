import { pako } from '../../@q3s/core/external.js'

const x64alphabet = '0123456789' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '-_'
const partDelimiter = '.'
const x64len = x64alphabet.length
const allx64Chars = x64alphabet + partDelimiter


/** @type {import('@q3s/core/data').intToX16Pos2} */
function intToX16Pos2(value) {
  return ('0' + value.toString(16)).slice(-2)
}

/** @type {import('@q3s/core/data').intToX16Pos3} */
function intToX16Pos3(value) {
  return ('00' + value.toString(16)).slice(-3)
}

/** @type {import('@q3s/core/data').intToX64} */
function intToX64(value) {
  let result = ''

  do {
    result = x64alphabet[value % x64len] + result
    value = value / x64len ^ 0
  } while (value > 0)

  return result
}

/** @type {import('@q3s/core/data').x64ToInt} */
function x64ToInt(value) {
  let result = 0

  while (value) {
    result += x64alphabet.indexOf(value[0]) * x64len ** (value.length - 1)
    value = value.slice(1)
  }

  return result
}

/** @type {import('@q3s/core/data').intToX64Pos2} */
function intToX64Pos2(value) {
  return ('0' + intToX64(value)).slice(-2)
}

/** @type {import('@q3s/core/data').encodeURLx64} */
function encodeURLx64(uint8Array) {
  // TODO: Подумать над оптимизацией алгоритма

  const x16 = uint8Array
    .reduce((data, item) => (data += intToX16Pos2(item)), '')
    .match(/.{1,3}/g)
  const last = x16[x16.length - 1].length < 3 ? x16.pop().replace(/^0+/, '') : ''
  const x64 = x16.reduce((data, item) => (data += intToX64Pos2(parseInt(item, 16))), '')

  return x64 + (last ? partDelimiter + last : '')
}

/** @type {import('@q3s/core/data').decodeURLx64} */
function decodeURLx64(x64text) {
  // TODO: Подумать над оптимизацией алгоритма
  const [x64, last] = x64text.split(partDelimiter)
  const x16 = x64
    .match(/.{1,2}/g)
    .reduce((data, item) => (data += intToX16Pos3(x64ToInt(item))), '') +
    (last || '')
  const uint8Array = x16.match(/.{1,2}/g)
    .map(item => parseInt(item, 16))

  return new Uint8Array(uint8Array)
}

/**
 * Сжатие текста с данными для использования в URL,
 *  использует только разрешенный для URL символы.
 *
 * @param {string} text
 * @returns {string}
 */
function deflateX64(text) {
  const rawData = pako.deflateRaw(text)
  const result = encodeURLx64(rawData)

  return result
}

/**
 * Распаковка сжатого текста с данными из URL.
 * Обратный метод для deflate.
 *
 * @param {string} text
 * @returns {string}
 */
function inflateX64(text) {
  const rawData = decodeURLx64(text)
  const result = pako.inflateRaw(rawData, { to: 'string' })

  return result
}


export {
  deflateX64, inflateX64
}
