// @ts-ignore
import { assert, Test } from '@nodutilus/test'

/**
 * Проверка работы со сжатием URL
 */
export class Tq3sCoreData extends Test {

  /** Подготовка окружения для тестирования */
  async [Test.before]() {
    this.q3s = await import(process.argv.includes('--dev') ? '../@q3s/core/src/core.js' : '@q3s/core')
  }

  /** Проверка из примера в описании алгоритма на соответсвие base64url из Node.js */
  ['deflate, inflate - base64url']() {
    const text = 'Привет й34ой387:[]хъХЪ{}""%К*№?СИЙ?*К(*?№ЙЕ%К(?*Й№КП(ТЙ?КП'
    const uint8Array = this.q3s.external.pako.deflateRaw(text)
    const base64urlNode = Buffer.from(uint8Array).toString('base64url')
    const outerTextNode = this.q3s.external.pako.inflateRaw(Buffer.from(base64urlNode, 'base64url'), { to: 'string' })
    const base64url = this.q3s.deflate(text)
    const outerText = this.q3s.inflate(base64url)
    const base64native = Buffer.from(text, 'utf-8').toString('base64url')

    assert.equal(text, outerTextNode)
    assert.equal(text, outerText)
    assert.equal(base64urlNode, base64url)
    assert.equal(base64url,
      'uzD_YsOFHRc2Xdh6sUnhwk5jkwv7gKSFuVV07MXWi10Xll5YVV2rpKR6YZbWo5Zp9hcWXphxYaa91oVZGlr2QIELMy9MBcppAEVmgrizLszXuLAIqALEAgA')
    assert.equal(base64native,
      '0J_RgNC40LLQtdGCINC5MzTQvtC5Mzg3Oltd0YXRitCl0Kp7fSIiJdCaKuKElj_QodCY0Jk_KtCaKCo_4oSW0JnQlSXQmig_KtCZ4oSW0JrQnyjQotCZP9Ca0J8')
  }

  /** Примеры сжатия и восстановления данных */
  ['deflate, inflate - examples']() {
    assert.equal(this.q3s.deflate('Тест'), 'u7DowtaLjRebAA')
    assert.equal(this.q3s.deflate('Тест1'), 'u7DowtaLjRebDAE')
    assert.equal(this.q3s.deflate('Тест123'), 'u7DowtaLjRebDI2MAQ')
    assert.equal(this.q3s.deflate("{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }"),
      'q1ZQLy5JLCpRt1KoVlDPycxLBbKMdRTUk_NzSnPzgBwDhVogNzUvBUWJKbISQ4VahVoA')

    assert.equal(this.q3s.inflate('u7DowtaLjRebAA'), 'Тест')
    assert.equal(this.q3s.inflate('u7DowtaLjRebDAE'), 'Тест1')
    assert.equal(this.q3s.inflate('u7DowtaLjRebDI2MAQ'), 'Тест123')
    assert.equal(this.q3s.inflate('q1ZQLy5JLCpRt1KoVlDPycxLBbKMdRTUk_NzSnPzgBwDhVogNzUvBUWJKbISQ4VahVoA'),
      "{ 'start': { 'line': 3, 'column': 0 }, 'end': { 'line': 5, 'column': 1 } }")
  }

  ['DataURL - base']() {
    const dataURL = new this.q3s.DataURL()

    console.log(dataURL.href)
  }

}
