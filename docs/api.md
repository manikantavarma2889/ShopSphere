# API Documentation

## Base URL
- **Development**: `http://localhost:8080/api/`
- **Production**: `https://api.shopsphere.com/api/`

## Authentication

All API endpoints require authentication except:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (with valid token)

### JWT Authentication
- **Header**: `Authorization: Bearer <token>`
- **Token**: JWT signed with HS256 algorithm
- **Secret**: Configured via `jwt.secret` environment variable
- **Expiration**: 24 hours (configurable via `jwt.expiration`)

### Login Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@shopsphere.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

### Token Refresh
- Use the refresh token endpoint or re-authenticate
- Tokens are stateless - validate signature and expiration

## Error Response Format

All errors follow a standardized format:

```json
{
  "timestamp": "2024-01-15T10:30:00.123+00:00",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request",
  "path": "/api/products"
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE/PUT without body |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, constraint violation |
| 500 | Internal Server | Unexpected error, contact support |

### Validation Error Details
```json
{
  "timestamp": "2024-01-15T10:30:00.123+00:00",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "1 validation error for User",
  "path": "/api/auth/register",
  "errors": [
    {
      "field": "email",
      "message": "Email should be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user profile | User |
| PUT | `/api/auth/profile` | Update user profile | User |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products with pagination | User |
| GET | `/api/products/{id}` | Get product by ID | User |
| POST | `/api/products` | Create product (ADMIN) | Admin |
| PUT | `/api/products/{id}` | Update product (ADMIN) | Admin |
| DELETE | `/api/products/{id}` | Delete product (ADMIN) | Admin |
| PATCH | `/api/products/{id}/inventory` | Update stock (ADMIN) | Admin |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List all categories | User |

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get cart contents | User |
| POST | `/api/cart/items` | Add item to cart | User |
| PATCH | `/api/cart/items/{productId}` | Update quantity | User |
| DELETE | `/api/cart/items/{productId}` | Remove item from cart | User |
| DELETE | `/api/cart` | Clear cart | User |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders` | List user orders | User |
| GET | `/api/orders/{id}` | Get order details | User |
| PATCH | `/api/orders/{id}/cancel` | Cancel order | User |

### Admin Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/orders` | List all orders | Admin |
| PATCH | `/api/admin/orders/{id}/status` | Update order status | Admin |

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments` | Create payment | User |
| GET | `/api/payments/{paymentId}` | Get payment status | User |
| GET | `/api/payments/order/{orderId}` | Get payment by order | User |

## Pagination

### Product Listing Pagination
```
GET /api/products?page=0&size=20
```

### Pagination Response
```json
{
  "content": [...products...],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "first": true,
  "last": false,
  "numberOfElements": 20
}
```

## Search

### Product Search
```
GET /api/products/search?q=shoes&minPrice=10&maxPrice=100&sortBy=price&order=asc
```

### Search Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (name/description) |
| `minPrice` | decimal | Minimum price filter |
| `maxPrice` | decimal | Maximum price filter |
| `categoryId` | long | Category filter |
| `sortBy` | string | Field to sort by |
| `order` | string | Sort order (asc/desc) |

## Filtering

### Available Filters
- **Category**: `categoryId=1`
- **Price Range**: `minPrice=10&maxPrice=100`
- **Stock**: `stockGT=0` (in stock)
- **Active**: `active=true`
- **Rating**: `ratingGT=4` (rating above 4)

## Sorting

### Sort Fields
- `price` - Sort by price
- `name` - Sort by name
- `createdAt` - Sort by creation date
- `rating` - Sort by rating

### Sort Order
- `asc` - Ascending
- `desc` - Descending

## Request/Response DTOs

### UserDTO
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@shopsphere.com",
  "role": "CUSTOMER",
  "enabled": true,
  "createdAt": "2024-01-15T10:30:00.123Z",
  "updatedAt": "2024-01-15T10:30:00.123Z"
}
```

### ProductDTO
```json
{
  "id": 1,
  "name": "Premium Leather Sofa",
  "description": "Elegant leather sofa with modern design",
  "price": 1299.99,
  "sku": "LS-001",
  "imageUrl": "/images/sofa.jpg",
  "categoryId": 1,
  "stockQuantity": 12,
  "active": true,
  "createdAt": "2024-01-15T10:30:00.123Z",
  "updatedAt": "2024-01-15T10:30:00.123Z"
}
```

### OrderDTO
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 1299.99,
  "status": "DELIVERED",
  "paymentStatus": "SUCCESS",
  "shippingAddress": "123 Main St, City, State 12345",
  "createdAt": "2024-01-15T10:30:00.123Z",
  "updatedAt": "2024-01-15T10:30:00.123Z",
  "orderItems": [...]
}
```

### PaymentDTO
```json
{
  "id": 1,
  "orderId": 1,
  "userId": 1,
  "amount": 1299.99,
  "status": "SUCCESS",
  "transactionReference": "DEMO-123456",
  "createdAt": "2024-01-15T10:30:00.123Z",
  "updatedAt": "2024-01-15T10:30:00.123Z"
}
```

## Swagger/OpenAPI

### Swagger UI
- **URL**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

### Annotations Used
- `@RestController`
- `@RequestMapping`
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`
- `@RequestParam`, `@PathVariable`, `@RequestBody`
- `@Valid`, `@NotNull`, `@NotBlank`, `@Email`, `@Size`
- `@AuthenticationPrincipal` (for current user)
- `@CrossOrigin` (CORS configuration)

### Security in Swagger
- OAuth2/JWT security scheme configured
- Public endpoints marked as `security: []`
- Protected endpoints require valid JWT token

## API Versioning

### Version Strategy
- **URL Versioning**: `/api/v1/products`
- **Deprecation**: Old versions marked deprecated after 6 months
- **Backward Compatibility**: New versions maintain backward compatibility

### Current Version
- All endpoints use implicit v1 (no version prefix in URL)
- Version documented in OpenAPI spec

## Rate Limiting

### Gateway Rate Limits
- **Default**: 100 requests per minute per IP
- **Auth Endpoints**: 10 requests per minute per IP
- **Product Endpoints**: 60 requests per minute per IP
- **Order Endpoints**: 30 requests per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1736925600
```

## WebSocket (Optional)

### Real-Time Features
- **Order Status Updates**: WebSocket for live order tracking
- **Stock Level Changes**: Real-time inventory updates
- **New Product Alerts**: Notify of new arrivals

### Endpoint
```
ws://localhost:8080/ws/{userId}
```