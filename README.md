# Simple NATS Cluster

Quick demo on how to use [NATS Streams](https://github.com/nats-io/nats-server) with NodeJS

## Prerequisites

- Docker
- NodeJS 16+

## Setup

- `docker-compose up` and wait for Nats to start
- `cd setup && ./build_and_run.sh` to create the stream (in a real world scenario this is done by the application)
- `npm i -g pm2` (if you want to stress test)

## How to run?

- start multiple producers to fill the stream `pm2 start producer/producer.mjs && pm2 scale producer 10` (each producer publishes 20000 messages with delivery ack)
  - this will start 10 producers and keep running forever
  - you can stop the producers with `pm2 stop producer`
- start a worker (or multiple on different terminals) `node worker/worker.mjs`
- you can also start workers with pm2 `pm2 start workers/worker.mjs && pm2 scale worker 5 && pm2 logs`

You can also look at debug output by running NATS toolbox container

- `docker run --network docker-compose-nats_nats --rm -it natsio/nats-box:latest`
- then `nats sub debug --server nats-1`

## Architecture

![concept](https://raw.githubusercontent.com/pablitovicente/nats-cluster/main/docs/demo-concept.png)

## TODO

- refactor the NodeJS code to be a bit less hacky
- provide a more complex stream and consumer structure
- dockerize everything
