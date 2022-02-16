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

    dataURL.application = 'q3s-dev.github.io'
    assert.equal(dataURL.application, 'q3s-dev.github.io')
    dataURL.application = 'тест'
    assert.equal(dataURL.application, 'q3s-dev.github.io')
    assert.equal(dataURL.href, 'https://q3s.github.io/#q3s-dev.github.io=')

    dataURL.data = 'Тест'
    assert.equal(dataURL.data, 'Тест')
    assert.equal(dataURL.encoded, 'u7DowtaLjRebAA')
    assert.equal(dataURL.href, 'https://q3s.github.io/#q3s-dev.github.io=u7DowtaLjRebAA')

    dataURL.application = ''
    assert.equal(dataURL.application, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/#=u7DowtaLjRebAA')
  }

  ['DataURL - restore']() {
    const dataURL1 = new this.q3s.DataURL('https://q3s.github.io/#q3s-dev.github.io=')
    const dataURL2 = new this.q3s.DataURL('https://q3s.github.io/#q3s-dev.github.io=u7DowtaLjRebAA')
    const dataURL3 = new this.q3s.DataURL('https://q3s.github.io/#=u7DowtaLjRebAA')

    assert.equal(dataURL1.application, 'q3s-dev.github.io')
    assert.equal(dataURL1.data, '')
    assert.equal(dataURL1.href, 'https://q3s.github.io/#q3s-dev.github.io=')

    assert.equal(dataURL2.application, 'q3s-dev.github.io')
    assert.equal(dataURL2.data, 'Тест')
    assert.equal(dataURL2.encoded, 'u7DowtaLjRebAA')
    assert.equal(dataURL2.href, 'https://q3s.github.io/#q3s-dev.github.io=u7DowtaLjRebAA')

    assert.equal(dataURL3.application, '')
    assert.equal(dataURL3.data, 'Тест')
    assert.equal(dataURL3.encoded, 'u7DowtaLjRebAA')
    assert.equal(dataURL3.href, 'https://q3s.github.io/#=u7DowtaLjRebAA')
  }

  ['DataURL - errors']() {
    const dataURL = new this.q3s.DataURL()
    let err = null

    try {
      dataURL.encoded = 'Тест'
    } catch (error) {
      err = error
    }
    assert.equal(err.message, 'The string to be decoded contains invalid characters.')
    assert.equal(dataURL.data, '')
    assert.equal(dataURL.encoded, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/')

    err = null
    try {
      dataURL.encoded = null
    } catch (error) {
      err = error
    }
    assert.equal(err.message, "Cannot read properties of null (reading 'replaceAll')")
    assert.equal(dataURL.data, '')
    assert.equal(dataURL.encoded, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/')

    err = null
    try {
      dataURL.data = null
    } catch (error) {
      err = error
    }
    assert.equal(err.message, "Cannot read properties of null (reading 'length')")
    assert.equal(dataURL.data, '')
    assert.equal(dataURL.encoded, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/')

    err = null
    try {
      dataURL.data = 1
    } catch (error) {
      err = error
    }
    assert.equal(err.message, 'strm.input.subarray is not a function')
    assert.equal(dataURL.data, '')
    assert.equal(dataURL.encoded, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/')

    dataURL.encoded = 'qwe'
    assert.equal(dataURL.data, '')
    assert.equal(dataURL.encoded, '')
    assert.equal(dataURL.href, 'https://q3s.github.io/')
  }

}
