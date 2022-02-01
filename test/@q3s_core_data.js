// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import { deflate, inflate } from '@q3s/core/data'
import { pako } from '../@q3s/core/external.js'
import { deflateX64, inflateX64 } from '../_deprecated/lib/data.js'


/**
 * Проверка работы со сжатием URL
 */
export class Tq3sCoreData extends Test {

  /** Проверка из примера в описании алгоритма на соответсвие base64url из Node.js */
  ['deflate, inflate - base64url']() {
    const text = 'Привет й34ой387:[]хъХЪ{}""%К*№?СИЙ?*К(*?№ЙЕ%К(?*Й№КП(ТЙ?КП'
    const uint8Array = pako.deflateRaw(text)
    const base64urlNode = Buffer.from(uint8Array).toString('base64url')
    const outerTextNode = pako.inflateRaw(Buffer.from(base64urlNode, 'base64url'), { to: 'string' })
    const base64url = deflate(text)
    const outerText = inflate(base64url)

    assert.equal(text, outerTextNode)
    assert.equal(text, outerText)
    assert.equal(base64urlNode, base64url)
  }

  /** Примеры сжатия и восстановления данных */
  ['deflate, inflate - examples']() {
    assert.equal(deflate('Тест'), 'u7DowtaLjRebAA')
    assert.equal(deflate('Тест1'), 'u7DowtaLjRebDAE')
    assert.equal(deflate('Тест123'), 'u7DowtaLjRebDI2MAQ')
    assert.equal(deflate("{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }"),
      'q1ZQLy5JLCpRt1KoVlDPycxLBbKMdRTUk_NzSnPzgBwDhVogNzUvBUWJKbISQ4VahVoA')

    assert.equal(deflateX64('Тест'), 'KX3EMJqbzhur')
    assert.equal(deflateX64('Тест1'), 'KX3EMJqbzhur30.1')
    assert.equal(deflateX64('Тест123'), 'KX3EMJqbzhur38Sc.1')
    assert.equal(deflateX64("{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }"),
      'GRpgbOV9b2FhJRaElB3fOsNb1racthjkA_dPiDfPw1M3xlEwdPkL1km9ar8igUlqxlE0')


    assert.equal(inflate('u7DowtaLjRebAA'), 'Тест')
    assert.equal(inflate('u7DowtaLjRebDAE'), 'Тест1')
    assert.equal(inflate('u7DowtaLjRebDI2MAQ'), 'Тест123')
    assert.equal(inflate('q1ZQLy5JLCpRt1KoVlDPycxLBbKMdRTUk_NzSnPzgBwDhVogNzUvBUWJKbISQ4VahVoA'),
      "{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }")

    assert.equal(inflateX64('KX3EMJqbzhur'), 'Тест')
    assert.equal(inflateX64('KX3EMJqbzhur30.1'), 'Тест1')
    assert.equal(inflateX64('KX3EMJqbzhur38Sc.1'), 'Тест123')
    assert.equal(inflateX64('GRpgbOV9b2FhJRaElB3fOsNb1racthjkA_dPiDfPw1M3xlEwdPkL1km9ar8igUlqxlE0'),
      "{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }")
  }

}
