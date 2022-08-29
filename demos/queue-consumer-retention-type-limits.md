# Queue Consumer Demo 2

This demo uses a stream with retention policy set to limits

## nats stream create

    ? Stream Name machine_data
    ? Subjects data.>
    ? Storage file
    ? Replication 3
    ? Retention Policy Limits
    ? Discard Policy Old
    ? Stream Messages Limit 10000000
    ? Per Subject Messages Limit -1
    ? Total Stream Size -1
    ? Total Stream Size 10000000000
    ? Message TTL 2y
    ? Max Message Size -1
    ? Duplicate tracking time window 2m0s
    ? Allow message Roll-ups No
    ? Allow message deletion Yes
    ? Allow purging subjects or the entire stream Yes

## nats consumer create

    ? Consumer name machine_data_consumer
    ? Delivery target (empty for Pull Consumers) machine_data_queue
    ? Delivery Queue Group machine_data_queue
    ? Start policy (all, new, last, subject, 1h, msg sequence) all
    ? Acknowledgement policy explicit
    ? Replay policy instant
    ? Filter Stream by subject (blank for all) 
    ? Maximum Allowed Deliveries -1
    ? Maximum Acknowledgements Pending 0
    ? Idle Heartbeat 0s
    ? Enable Flow Control, ie --flow-control No
    ? Deliver headers only without bodies No
    ? Add a Retry Backoff Policy No
    ? Select a Stream machine_data

## Demo Code

NodeJS code in the `/demos` folder can be used to produce and consume messages
