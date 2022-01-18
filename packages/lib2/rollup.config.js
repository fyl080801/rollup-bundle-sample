// eslint-disable-next-line @typescript-eslint/no-var-requires
const { rollups } = require('../../build')

const configs = {
  types: ['umd', 'iife', 'esm'],
  external: [],
}

const entries = (() => {
  const entries = {}
  entries['lib2'] = './lib/index.js'

  const result = rollups.establish(entries, configs)
  return result
})()

export default entries
