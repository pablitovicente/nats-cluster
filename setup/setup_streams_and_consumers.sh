#!/bin/sh
echo ""
echo "Creating machine_data Stream. If the stream already existed the command has no effect when same config is used."
nats --server nats-1 str add machine_data --config /setup/machine_data_stream.json
echo ""
echo "Creating machine_data_queue Consumer. If the consumer already existed the command has no effect when same config is used."
nats --server nats-1 con add machine_data machine_data_consumer --config /setup/consumer_machine_data_queue.json
