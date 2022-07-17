# Simple NATS Cluster with Jetstream for benchmarking and load testing

## How to run?

- simply run `docker-compose up`

## Load Testing Tool

- Download one of the releases of emqtt-bench from https://github.com/emqx/emqtt-bench/releases

This tool is helpful for observing CPU/Memory usage of NATS under different loads

### Connections

```./emqtt_bench conn -c 20000 -i 1 -V 4 -n 10000```

### Publish

```./emqtt_bench pub -c 10000 -I 2 -t bench/%i -s 1024 -V 4 -L 10000```

### Subscribe

```./emqtt_bench sub -c 20000 -i 10 -t bench/%i -q 2 -V 4```

## Dirty Hacky BenchMarking

In a 8C/16T machine with 32GB 700K message of 1KB each per second were possible (probably limited by the heavy CPU usage of NodeJS. It's possible that with a better benchmark tool much higher rates are possible). NATS memory consumption was 1GB and CPU 350% for each node.

- `npm i mqtt` and run the script below with ```pm2 start <the file name of the saved script>```
- ```pm2 scale bench 15``` to scale to 15 copies of the script

```
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://localhost')

const dummyMsg = JSON.stringify(Buffer.alloc(1024))

client.on('connect', function () {
  for (let i=0; i < 500; i+=1) {
    setInterval(() => {
      client.publish('debug', dummyMsg)
    }, 0)
  }
})
```