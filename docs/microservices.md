# Microservices Architecture

## Why Microservices?

### Benefits
- **Independent Scaling**: Each service can scale independently based on load
- **Fault Isolation**: Failures in one service don't cascade to others
- **Technology Heterogeneity**: Each service can use the best-fit technology
- **Team Autonomy**: Small teams can own and evolve services independently
- **Faster Deployments**: Smaller codebases mean quicker deployment cycles
- **Continuous Delivery**: Easier to implement CI/CD for individual services

### Trade-offs
- **Operational Complexity**: More moving parts to monitor and manage
- **Data Consistency**: Distributed data management is more challenging
- **Network Latency**: Inter-service communication over network
- **Testing Complexity**: End-to-end testing requires more coordination
- **Observability**: Need comprehensive logging and monitoring

## Service Responsibilities

### service-discovery
- **Single Responsibility**: Eureka Server for service registration and discovery
- **Key Metrics**: Service uptime, registration status, health checks
- **Dependencies**: None (acts as root service)

### api-gateway
- **Single Responsibility**: Request routing, protocol translation, composition
- **Key Metrics**: Request latency, error rates, circuit breaker trips
- **Dependencies**: Eureka Server, all microservices

### auth-service
- **Single Responsibility**: Authentication and authorization
- **Key Metrics**: Login success/failure rates, token validation time, user sessions
- **Dependencies**: PostgreSQL (auth_schema), Eureka

### product-service
- **Single Responsibility**: Product catalog and inventory management
- **Key Metrics**: Product CRUD operations, search latency, stock levels
- **Dependencies**: PostgreSQL (product_schema), Eureka, product-service communication

### order-service
- **Single Responsibility**: Order management and cart functionality
- **Key Metrics**: Order creation time, cart operations, order status transitions
- **Dependencies**: PostgreSQL (order_schema), product-service (stock validation), payment-service, Eureka

### payment-service
- **Single Responsibility**: Demo payment processing (simulation only)
- **Key Metrics**: Payment success/failure rates, idempotency verification
- **Dependencies**: PostgreSQL (payment_schema), order-service, Eureka

### notification-service (Optional)
- **Single Responsibility**: Order and payment notifications
- **Key Metrics**: Notification delivery rates, email/SMS success rates
- **Dependencies**: All services (for event data)

## Service Discovery with Eureka

### How It Works
1. **Service Registration**: Each microservice registers itself with the Eureka Server on startup
2. **Service Metadata**: Services register with metadata including host, port, health URL, and status
3. **Registry Maintenance**: Eureka Server maintains a registry of all running services
4. **Client-Side Discovery**: API Gateway and other services use the registry to locate services
5. **Renewal**: Services renew their lease every 30 seconds (default)
6. **Eviction**: Services are evicted if they don't renew within 90 seconds (default)

### Why Service Discovery is Useful
- **No Hardcoding**: Services don't need to know each other's addresses
- **Dynamic Environments**: Automatically handles scaling, restarts, and IP changes
- **Load Balancing**: Can integrate with Ribbon or LoadBalancer for request distribution
- **Resilience**: Services can come and go without affecting the overall system
- **Configuration Simplicity**: Only need to know Eureka server address

### How Gateway Finds Services
1. API Gateway is configured with Eureka server URL
2. Gateway registers itself with Eureka
3. When routing a request, Gateway queries Eureka for the service address
4. Gateway routes the request to the discovered service instance
5. Circuit breakers protect against unresponsive services

## Spring Cloud Components

### Spring Cloud Gateway
- **Request Routing**: Matches requests to services based on predicates
- **Filters**: Transforms requests and responses
- **Circuit Breaker**: Integrates with Resilience4j
- **Global Filters**: Apply to all routes (logging, CORS, etc.)

### Spring Cloud Config
- **External Configuration**: Centralized configuration management
- **Git-Backed**: Configuration stored in Git repository
- **Encrypted**: Support for encrypted properties

### Spring Cloud Circuit Breaker
- **Resilience4j Integration**: Fallback mechanisms
- **Rate Limiting**: Prevents overload
- **Retry**: Automatic retry of failed requests

## Inter-Service Communication

### OpenFeign
- **Declarative REST Client**: Simplifies HTTP client development
- **Annotation-Based**: `@FeignClient`, `@GetMapping`, `@PostMapping`
- **Automatic Retry**: Built-in retry logic
- **Load Balancing**: Integrates with Ribbon

### RestTemplate
- **Imperative Client**: Lower-level HTTP client
- **More Control**: Full control over request/response handling
- **Manual Retry**: Requires explicit retry logic

### Direct REST Calls
- **WebClient**: Reactive HTTP client
- **Functional Endpoints**: Lambda-style request building
- **Better Performance**: Non-blocking I/O

## Database Ownership

### Key Principle
Each service owns its data completely. No service should directly access another service's tables.

### Communication Patterns
- **Saga Pattern**: For multi-service transactions
- **Event-Driven**: Using message brokers for eventual consistency
- **API Calls**: Synchronous communication for immediate needs
- **Read Replicas**: For cross-service data views

### Example: Order Service → Product Service
```java
// Order Service calls Product Service for stock validation
@FeignClient(name = "product-service", url = "lb://product-service")
public interface ProductClient {
    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);
    
    @PutMapping("/api/products/{id}/inventory")
    void updateInventory(@PathVariable("id") Long id, @RequestBody InventoryUpdateRequest request);
}
```

## Deployment Patterns

### Independent Deployment
Each service can be deployed independently:
```yaml
# docker-compose.yml example
services:
  auth-service:
    image: shopsphere/auth:1.0.0
    ports: ["8081:8081"]
    depends_on: [eureka-server]
  
  product-service:
    image: shopsphere/product:1.0.0
    ports: ["8082:8082"]
    depends_on: [eureka-server]
  
  order-service:
    image: shopsphere/order:1.0.0
    ports: ["8083:8083"]
    depends_on: [eureka-server, product-service, payment-service]
```

### Docker Compose for Local Dev
```bash
docker-compose up -d  # Start all services
# Access:
# - Eureka: http://localhost:8761
# - Gateway: http://localhost:8080
# - Frontend: http://localhost:5173
```

### Production Considerations
- **Service Mesh**: Consider Istio or Linkerd for advanced routing
- **Service Registry**: Eureka for on-prem, Consul for multi-cloud
- **API Gateway**: Spring Cloud Gateway or Kong or AWS API Gateway
- **Service Mesh Sidecars**: For observability and traffic management
- **Health Checks**: Endpoints at /actuator/health
- **Logging**: Centralized via ELK or Loki
- **Metrics**: Prometheus + Grafana for monitoring