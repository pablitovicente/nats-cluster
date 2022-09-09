import { createClient } from 'redis'

class Storage {
  constructor () {
    this.dbClient = createClient()
    this.dbClient.on('error', (err) => {
      throw err
    })
  }

  async connect () {
    await this.dbClient.connect()
  }

  async save (key, value) {
    await this.dbClient.set(key, JSON.stringify(value))
  }

  async get (key) {
    const res = await this.dbClient.get(key)
    return JSON.parse(res)
  }

  async getAllForNamespace (namespace) {
    const keysFound = []
    for await (const aKey of this.dbClient.scanIterator({ MATCH: `${namespace}:*`, COUNT: 100 })) {
      keysFound.push(aKey)
    }
    const res = await this.dbClient.mGet(keysFound)

    return res.map((val) => JSON.parse(val))
  }
}

export {
  Storage,
}
