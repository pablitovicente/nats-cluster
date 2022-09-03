docker build . -t setup-streams:latest
docker run --rm --network docker-compose-nats_nats setup-streams:latest /setup/setup_streams_and_consumers.sh
