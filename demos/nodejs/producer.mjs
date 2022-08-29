import { randomBytes } from 'crypto'
import { connectNats } from './utils/index.mjs'

let natsConn
const logger = console

try {
  // connect
  natsConn = await connectNats({ servers: ['localhost:4222', 'localhost:4223', 'localhost:4224'] })
  // Create Jetstream client
  const jetstreamClient = natsConn.jetstream()

  let pendingMessages = 10000
  // Publish messages with 1KB payload
  while (pendingMessages) {
    await jetstreamClient.publish(`data.node_machine_${Math.floor(Math.random() * (pendingMessages) + 1)}`, randomBytes(1000))
    pendingMessages -= 1
  }

  logger.info('Done. Quitting.')
  await natsConn.drain()
  await natsConn.close()
  process.exit()
} catch (err) {
  logger.error('Encountered an error')
  logger.error(err)
}

const drain = async () => {
// we want to insure that messages that are in flight
  // get processed, so we are going to drain the
  // connection. Drain is the same as close, but makes
  // sure that all messages in flight get seen
  // by the iterator. After calling drain on the connection
  // the connection closes.
  logger.info('Draining NATS connection...')
  await natsConn.drain()
  await natsConn.close()
  logger.info('Done. Quitting.')
}

process.on('SIGTERM', await drain)
process.on('SIGINT', await drain)
