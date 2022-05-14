import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import { resolve } from 'path'

const fastify = Fastify({ logger: true })


fastify
  .register(FastifyStatic, { root: resolve('./docs'), prefix: '/' })
  .listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`${address}`)
  })
