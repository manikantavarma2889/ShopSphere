# Background Order Notifications

ShopSphere's Order Service uses RabbitMQ to process order-confirmation jobs outside the checkout request.

## Flow

1. The Order Service saves an order and publishes an application event.
2. A transactional event listener waits until the database transaction commits.
3. The listener publishes a persistent JSON message to the durable `shopsphere.order-confirmation` queue.
4. The `OrderConfirmationWorker` consumes the message independently and logs the processed order details.

The worker currently demonstrates the background-processing flow. It does not send an actual email yet; connect an email provider when delivery credentials are available.

## Run locally

Start the application dependencies and services:

```bash
docker compose up --build
```

RabbitMQ's management UI is available at http://localhost:15672 with the local development credentials `guest` / `guest`. The AMQP endpoint is localhost:5672.

When checkout succeeds, inspect the Order Service logs for messages indicating that an order confirmation job was queued and processed.

## Configuration

The Order Service supports these environment variables:

- `RABBITMQ_HOST` (default: `localhost`)
- `RABBITMQ_PORT` (default: `5672`)
- `RABBITMQ_USERNAME` (default: `guest`)
- `RABBITMQ_PASSWORD` (default: `guest`)

The queue and exchange names are configured in `order-service/src/main/resources/application.yml`.

## Reliability note

The queue and messages are durable, but the database commit and message publication are not a single atomic operation. For stronger production guarantees, add a transactional outbox and publisher confirms, plus retry/dead-letter handling before using this flow for critical notifications.
