import { randomBytes } from 'crypto'
import ProgressBar from 'progress'
import { connectNats } from './utils/index.mjs'

let natsConn
const logger = console

try {
  // connect
  natsConn = await connectNats({ servers: ['localhost:4222', 'localhost:4223', 'localhost:4224'] })
  // Create Jetstream client
  const jetstreamClient = natsConn.jetstream()

  let pendingMessages = 200000
  const progressBar = new ProgressBar(':bar :percent', { total: pendingMessages })
  logger.info(`Publishing ${pendingMessages} messages`)
  // Publish messages with 1KB payload
  while (pendingMessages) {
    progressBar.tick()
    await jetstreamClient.publish(
      `data.node_machine_${Math.floor(Math.random() * (pendingMessages) + 1)}`,
      Buffer.from(JSON.stringify({ val: pendingMessages, data: randomBytes(1000) })),
    )
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
