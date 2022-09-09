import { connect } from 'nats'

/**
 * Connects and returns Nats Connection
 * TODO: add retry logic
 * @param {Object} config
 * @returns {Promise<import('nats').NatsConnection>}
 */
const connectNats = async (config) => {
  const nc = await connect(config)
  return nc
}

/**
 *
 * @param {import('nats').NatsConnection} natsConn
 * @returns {Promise<import('nats').JetStreamManager>}
 */
const getJetstreamManager = async (natsConn) => {
  const jsm = await natsConn.jetstreamManager()
  return jsm
}

const createStream = async (name, subjects, streamManager) => {
  const newStream = await streamManager.streams.add({
    name,
    subjects,
  })
  return newStream
}

const createConsumer = async (streamName, config, streamManager) => {
  const consumer = await streamManager.consumers.add(streamName, config)
  return consumer
}

export {
  connectNats,
  getJetstreamManager,
  createStream,
  createConsumer,
}
