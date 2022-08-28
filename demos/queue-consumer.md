# Queue Consumer Demo

This demo shows how to create a stream and a push consumer with queue group config.

## Stream Config

Create a stream and select the values shown in the config below

    nats stream info
    ? Select a Stream queue_stream
    Information for Stream queue_stream created 2022-08-28T22:01:34+02:00
    
    Configuration:
    
                 Subjects: data.>
         Acknowledgements: true
                Retention: File - WorkQueue
                 Replicas: 3
           Discard Policy: Old
         Duplicate Window: 2m0s
        Allows Msg Delete: true
             Allows Purge: true
           Allows Rollups: false
         Maximum Messages: unlimited
            Maximum Bytes: 954 MiB
              Maximum Age: unlimited
     Maximum Message Size: unlimited
        Maximum Consumers: unlimited

    Cluster Information:

                     Name: IIOT
                   Leader: NATS-1
                  Replica: NATS-2, current, seen 0.27s ago
                  Replica: NATS-3, current, seen 0.27s ago

    State:

                 Messages: 0
                    Bytes: 0 B
                 FirstSeq: 777,899
                  LastSeq: 777,898 @ 2022-08-28T20:22:29 UTC
         Active Consumers: 1

## Consumer Config

Create a consumer and select the values shown in the config below

    nats consumer info
    ? Select a Stream queue_stream
    ? Select a Consumer queue
    Information for Consumer queue_stream > queue created 2022-08-28T22:09:55+02:00
    
    Configuration:
    
            Durable Name: queue
        Delivery Subject: queue_stream_consumer
          Filter Subject: data.>
          Deliver Policy: All
     Deliver Queue Group: queue_stream_consumer
              Ack Policy: Explicit
                Ack Wait: 30s
           Replay Policy: Instant
         Max Ack Pending: 1,000
            Flow Control: false
    
    Cluster Information:
    
                    Name: IIOT
                  Leader: NATS-1
                 Replica: NATS-2, current, seen 0.88s ago
                 Replica: NATS-3, current, seen 0.88s ago
    
    State:
    
       Last Delivered Message: Consumer sequence: 779,867 Stream sequence: 777,898 Last delivery: 8m57s ago
         Acknowledgment floor: Consumer sequence: 779,867 Stream sequence: 777,898 Last Ack: 8m57s ago
         Outstanding Acks: 0 out of maximum 1,000
         Redelivered Messages: 0
         Unprocessed Messages: 0
              Active Interest: Active using Queue Group queue_stream_consumer

## Start some jetstream consumers

By specifying a queue when using `nats sub` NATS will deliver unique messages to each subscriber

- `$ nats sub queue_stream_consumer --queue=queue_stream_consumer --ack`
- `$ nats sub queue_stream_consumer --queue=queue_stream_consumer --ack`
- `$ nats sub queue_stream_consumer --queue=queue_stream_consumer --ack`

With the previous commands we subscribe to subject `queue_stream_consumer`, which was specified as `Delivery Subject` when creating the Consumer, and the value for `--queue` matches the string specified in `Delivery Queue Group` which was also specified during Consumer creation.

## Send messages to the Stream

In this example we configured a Stream that collects data from the subject `data.>` so let's publish some messages so the workers that we started on the previous step can process them.

- `$ nats pub data.machine_A --count=80000 --sleep 0ms "publication #{{Count}} @ {{TimeStamp}}"`
- `$ nats pub data.machine_B --count=80000 --sleep 0ms "publication #{{Count}} @ {{TimeStamp}}"`
- `$ nats pub data.machine_C --count=80000 --sleep 0ms "publication #{{Count}} @ {{TimeStamp}}"`

When this commands are all run each subscriber will get one of the messages being published distributing work among each of them, in an application context the subject could be used to make different decisions about the data based on it for example.
