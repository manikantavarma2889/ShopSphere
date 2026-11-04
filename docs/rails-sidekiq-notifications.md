# Ruby on Rails + Sidekiq order notifications

ShopSphere now has a Ruby notification service alongside its Java/Spring Boot services.

## Event flow

1. The order service publishes an order-confirmation message to RabbitMQ after the database transaction commits.
2. The Java RabbitMQ listener forwards the event to the authenticated Rails endpoint at `POST /internal/order-confirmations`.
3. Rails validates the service token and required fields, then enqueues `OrderConfirmationJob`.
4. Sidekiq fetches the job from Redis and processes it asynchronously.

RabbitMQ remains the durable handoff from the order service. Sidekiq + Redis handles the Rails application's background execution.

## Run locally

From the repository root:

```bash
docker compose up --build
```

Rails health endpoint: `http://localhost:3000/health`.

Sidekiq and Rails share the same notification-service image and Redis connection. Redis is available internally to the Compose network on port 6379.

## Configuration

- `NOTIFICATION_SERVICE_TOKEN`: shared secret used by the Java worker and Rails API. Set a strong value outside local development.
- `REDIS_URL`: Redis connection used by Sidekiq.
- `NOTIFICATION_SERVICE_URL`: Rails API base URL used by the Java worker.
- `SECRET_KEY_BASE`: Rails secret; override the local development fallback for deployed environments.

## Current scope and production follow-ups

The Sidekiq job logs a structured order-confirmation event. It does not send an actual email until an email provider and credentials are configured. The service token is a simple service-to-service authentication mechanism; production deployments should use secret management, TLS, token rotation, request limits, and monitoring. RabbitMQ redelivery and Sidekiq retries are at-least-once, so real notification delivery should be made idempotent. The existing RabbitMQ publisher also still needs a transactional outbox/publisher-confirm strategy for stronger delivery guarantees.
