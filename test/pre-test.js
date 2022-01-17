import { mkdirSync, symlinkSync, existsSync } from 'fs'

mkdirSync('test/node_modules', { recursive: true })
if (!existsSync('test/node_modules/@notml')) {
  symlinkSync('../../@q3s', 'test/node_modules/@q3s', 'dir')
}
