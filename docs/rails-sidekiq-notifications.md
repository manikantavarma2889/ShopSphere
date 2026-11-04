# Ruby on Rails + Sidekiq order notifications

A dedicated Ruby on Rails API accepts order-confirmation events from the Java order service and enqueues them for Sidekiq workers backed by Redis.

## Event flow

1. Spring Boot publishes the order event to RabbitMQ after the order transaction commits.
2. The Java RabbitMQ listener forwards the event to Rails at POST /internal/order-confirmations.
3. Rails validates the shared service token and enqueues OrderConfirmationJob.
4. Sidekiq executes the job asynchronously using Redis.

RabbitMQ is the durable handoff from the order service; Sidekiq + Redis run background work in the Rails service.

## Run locally

From the repository root, set NOTIFICATION_SERVICE_TOKEN to a strong local secret, then run:

    docker compose up --build

Rails health endpoint: http://localhost:3000/health.

## Configuration

- NOTIFICATION_SERVICE_TOKEN: shared secret between the Java worker and Rails API.
- NOTIFICATION_SERVICE_URL: Rails API base URL used by the Java worker.
- REDIS_URL: Redis connection used by Sidekiq.
- SECRET_KEY_BASE: Rails secret; override the development fallback for deployed environments.

## Current scope

The job logs a structured order-confirmation event. It does not send an email until an email provider and credentials are configured. Production follow-ups include secret management, TLS, token rotation, request limits, monitoring, idempotency, and stronger RabbitMQ publisher/outbox delivery guarantees.
