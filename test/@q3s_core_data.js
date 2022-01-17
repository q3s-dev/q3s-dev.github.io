// @ts-ignore
import { assert, Test } from '@nodutilus/test'
import {
  __internal, encodeURLx64, decodeURLx64
} from '@q3s/core/data'


/**
 * Проверка работы со сжатием URL
 */
export class Tq3sCoreData extends Test {

  /** Приведение к числу с основанием 16, максимум 2 знака, 0-255 */
  ['intToX16Pos2']() {
    assert.equal(__internal.intToX16Pos2(1), '01')
    assert.equal(__internal.intToX16Pos2(15), '0f')
    assert.equal(__internal.intToX16Pos2(16), '10')
    assert.equal(__internal.intToX16Pos2(255), 'ff')
  }

  /** Приведение к числу с основанием 16, максимум 3 знака, 0-4095 */
  ['intToX16Pos3']() {
    assert.equal(__internal.intToX16Pos3(1), '001')
    assert.equal(__internal.intToX16Pos3(15), '00f')
    assert.equal(__internal.intToX16Pos3(16), '010')
    assert.equal(__internal.intToX16Pos3(255), '0ff')
    assert.equal(__internal.intToX16Pos3(4095), 'fff')
  }

  /** Приведение к числу с основанием 64 */
  ['intToX64']() {
    assert.equal(__internal.intToX64(1), '1')
    assert.equal(__internal.intToX64(63), '_')
    assert.equal(__internal.intToX64(64), '10')
  }

  /** Восстановление числа с основанием 64 в 10 */
  ['x64ToInt']() {
    assert.equal(__internal.x64ToInt('1'), 1)
    assert.equal(__internal.x64ToInt('_'), 63)
    assert.equal(__internal.x64ToInt('10'), 64)
  }

  /** Приведение к числу с основанием 64, максимум 2 знака, 0-4095 */
  ['intToX64Pos2']() {
    assert.equal(__internal.intToX64Pos2(1), '01')
    assert.equal(__internal.intToX64Pos2(15), '0f')
    assert.equal(__internal.intToX64Pos2(16), '0g')
    assert.equal(__internal.intToX64Pos2(64), '10')
    assert.equal(__internal.intToX64Pos2(255), '3_')
    assert.equal(__internal.intToX64Pos2(4095), '__')
  }

  /** Проеобразуем 8-битный массив в строку */
  ['encodeURLx64']() {
    const encoder = new TextEncoder()

    const txt = encoder.encode('Тест QabgJt61Qo')
    console.time('url64')
    const url64 = encodeURLx64(txt)
    console.timeEnd('url64')
    console.time('base64')
    const base64 = btoa(txt)
    console.timeEnd('base64')

    console.log(url64)
    console.log(base64)

    assert.equal(encodeURLx64(encoder.encode('Тест')), 'QabgJt61Qo.2')
    assert.equal(encodeURLx64(encoder.encode('Тест1')), 'QabgJt61Qo8N')
    assert.equal(encodeURLx64(encoder.encode('Тест123')), 'QabgJt61Qo8Ncz.3')
    assert.equal(encodeURLx64(new Uint8Array([255, 255, 255])), '____')
    assert.equal(encodeURLx64(new Uint8Array([1, 15, 16, 255])), '0gYg.ff')
    assert.equal(encodeURLx64(new Uint8Array([1, 15, 16, 1])), '0gYg.1')
  }

  /** Проеобразуем строку в 8-битный массив */
  ['decodeURLx64']() {
    const decoder = new TextDecoder()

    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo.2')), 'Тест')
    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo8N')), 'Тест1')
    assert.equal(decoder.decode(decodeURLx64('QabgJt61Qo8Ncz.3')), 'Тест123')
    assert.deepEqual(decodeURLx64('____'), new Uint8Array([255, 255, 255]))
    assert.deepEqual(decodeURLx64('0gYg.ff'), new Uint8Array([1, 15, 16, 255]))
    assert.deepEqual(decodeURLx64('0gYg.1'), new Uint8Array([1, 15, 16, 1]))
  }

}
