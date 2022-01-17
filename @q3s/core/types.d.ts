declare module '@q3s/core/data' {

  interface intToX16Pos2 {
    /** Преобразует 10-чное (0-255) число в 16-разрядную систему счисления со сохранением ведущего 0 (до 2-х символов) */
    (value: number): string
  }

  interface intToX16Pos3 {
    /** Преобразует 10-чное число (0-4095) в 16-разрядную систему счисления со сохранением ведущего 0 (до 3-х символов) */
    (value: number): string
  }

  interface intToX64 {
    /** Преобразует 10-чное число в 64-разрядную систему счисления согласно алфавиту на основе BASE64 */
    (value: number): string
  }

  interface x64ToInt {
    /** Преобразует число в 64-разрядной системе счисления в 10-чное согласно алфавиту на основе BASE64 */
    (value: string): number
  }

  interface intToX64Pos2 {
    /** Преобразует 10-чное (0-4095) число в 64-разрядную систему счисления со сохранением ведущего 0 (до 2-х символов) */
    (value: number): string
  }

  interface encodeURLx64 {
    (uint8Array: Uint8Array): string
  }

  interface decodeURLx64 {
    (x64text: string): Uint8Array
  }

  export const __internal: {
    intToX16Pos2: intToX16Pos2
    intToX16Pos3: intToX16Pos3
    intToX64: intToX64
    x64ToInt: x64ToInt
    intToX64Pos2: intToX64Pos2
  }
  export const encodeURLx64: encodeURLx64
  export const decodeURLx64: decodeURLx64
}
