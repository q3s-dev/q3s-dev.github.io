import { pako } from '../src/external.js'
import {
  allx64Chars,
  encodeURLx64,
  decodeURLx64
} from './x64url.js'

const urlSpecialChars = "#=?/:,;@+!~*'()"
const urlValidCharsSet = allx64Chars.replace('-', '\\-') + urlSpecialChars
const urlValidCharsRE = new RegExp(`^[${urlValidCharsSet}]+$`)
const { location, URL, URLSearchParams } = window


/**
 * Проверяет что строка содержит только разрешенные для URL символы
 *
 * @param {string} text
 * @returns {boolean}
 */
function testURLChars(text) {
  const result = urlValidCharsRE.test(String(text))

  return result
}


/**
 * Декодирует спецсимволы внутри параметров поиска в url,
 *  которые корректно воспринимаются при получении данных из URLSearchParams
 *
 * @param {string} url
 * @returns {string}
 */
function decodeURISearch(url) {
  const result = url.replace(/%2F/g, '/')

  return result
}


/**
 * Сжатие json-объекта для использования в URL,
 *  использует только разрешенный для URL символы.
 *
 * @param {object} json
 * @returns {string}
 */
function deflateJSONURL(json) {
  const text = JSON.stringify(json)
  const deflateRaw = pako.deflateRaw(text)
  const deflate = encodeURLx64(deflateRaw)

  return deflate
}


/**
 * Распаковка сжатого json-объекта из URL.
 * Обратный метод для deflateJSONURL.
 *
 * @param {string} text
 * @returns {object}
 */
function inflateJSONURL(text) {
  const inflate = decodeURLx64(text)
  const inflateRaw = pako.inflateRaw(inflate, { to: 'string' })
  const json = JSON.parse(inflateRaw)

  return json
}


/**
 * Анализирует переданный URL и получает из него параметры,
 *  для генерации объекта данных одной из поддерживаемых моделей.
 *
 * @param {string} plainURL
 */
function parseURL(plainURL) {
  const url = new URL(plainURL, location.origin)
  const hash = url.hash.replace(/^#/, '')
  const searchParams = new URLSearchParams(hash)
  const plainObject = {}

  for (const [key, value] of searchParams.entries()) {
    if (key && !value) {
      Object.assign(plainObject, inflateJSONURL(key))
    } else if (key && value) {
      plainObject[key] = value
    }
  }

  return plainObject
}


export {
  testURLChars,
  decodeURISearch,
  deflateJSONURL,
  inflateJSONURL,
  parseURL
}
