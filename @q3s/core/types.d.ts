declare module '__data__' {

  interface deflate {
    /**
     * Сжатие текста с данными при помощи zlib (@see https://npmjs.com/package/pako)
     * Для представления выходных данных от pako используется стандарт Base64 для кодирования URL адресов,
     *  аналог в Node.js `Buffer.from(uint8Array).toString('base64url')`.
     * Возвращает строку данных которая будет корректно восприниматься в URL
     */
    (text: string): string
  }

  interface inflate {
    /**
     * Восстановление сжатого текста с данными из Base64 для кодирования URL адресов.
     * Обратное преобразование для deflate.
     */
    (base64url: string): string
  }

  export const deflate: deflate
  export const inflate: inflate

}

declare module '__external__' {

  import pako from 'pako'

  export { pako }

}

declare module '@q3s/core' {

  export * from '__data__'
  export * as external from '__external__'

}
