import { consumerOpts } from 'nats'
import http from 'http'
import { connectNats } from './utils/index.mjs'

let natsConn
let processedMessages = 0
const logger = console

const requestListener = (req, res) => {
  const response = {
    now: new Date(),
    processedMessages,
  }
  res.writeHead(200)
  res.end(JSON.stringify(response))
}

const server = http.createServer(requestListener)
server.listen(10000)

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
  process.exit()
}

process.on('SIGTERM', await drain)
process.on('SIGINT', await drain)

// Process messages
try {
  // connect
  natsConn = await connectNats({ servers: ['localhost:4222', 'localhost:4223', 'localhost:4224'] })
  // Create Jetstream client
  const jetstreamClient = natsConn.jetstream()

  const opts = consumerOpts()
  opts.queue('machine_data_queue')
  opts.bind('machine_data', 'machine_data_consumer')

  const sub = await jetstreamClient.subscribe('machine_data_queue', opts)
  // process messages
  for await (const m of sub) {
    console.log(`worker got sequence: ${m.seq} on topic: ${m.subject}`)
    m.ack()
    // do any work here
    processedMessages += 1
  }
} catch (err) {
  logger.error('Encountered an error')
  logger.error(err)
}
