# Security Guide

## Security Philosophy

ShopSphere implements security as a foundational requirement, not an afterthought. The system follows the principle of "security by design" with defense-in-depth across all layers.

## Authentication Security

### JWT (JSON Web Tokens)
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Token Signing**: Uses secret key from environment variable `jwt.secret`
- **Token Expiration**: 24 hours (configurable via `jwt.expiration`)
- **Refresh Mechanism**: Optional refresh token flow

### BCrypt Password Hashing
- **Algorithm**: BCrypt (Adaptive Hash Function)
- **Work Factor**: Default cost factor (recommended 12-14)
- **Never Store**: Plain-text passwords
- **Verification**: `BCryptPasswordEncoder.matches()` for login

### Password Policy
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and special characters
- No common passwords (dictionary check recommended)
- Password rotation encouraged every 90 days

## Authorization Security

### Role-Based Access Control (RBAC)
- **CUSTOMER**: Access to customer-facing endpoints only
- **ADMIN**: Access to all endpoints including admin dashboard
- **Principle**: Backend is authoritative; frontend role checks are supplementary

### Endpoint Security
```java
// Secure endpoint example
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/orders")
public List<OrderDTO> getAllAdminOrders() { ... }

// Customer can only access their own orders
@PreAuthorize("authentication.principal.userId == #orderId || hasRole('ADMIN')")
@GetMapping("/api/orders/{orderId}")
public OrderDTO getOrderDetails(@PathVariable Long orderId) { ... }
```

### Security Context
- Spring Security populates `SecurityContextHolder` on each request
- `Authentication` object contains user details and authorities
- Token validation occurs in `JwtAuthenticationFilter` on every request

## Input Validation

### Bean Validation
- **@NotNull**: Field must not be null
- **@NotBlank**: Field must not be null or empty whitespace
- **@Size(min, max)**: Field length constraints
- **@Email**: Valid email format
- **@Positive**: Numeric value must be > 0
- **@Min(value)**: Numeric value must be >= specified minimum
- **@Max(value)**: Numeric value must be <= specified maximum

### Controller-Level Validation
```java
@PostMapping("/register")
public ResponseEntity<?> register(
    @Valid @RequestBody RegistrationRequest request,
    BindingResult bindingResult
) {
    if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest()
                .body(buildErrorResponse(bindingResult.getAllErrors()));
    }
    // Process registration
}
```

### Global Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        // Standardized error response
        return ResponseEntity.badRequest()
                .body(ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.BAD_REQUEST)
                    .error("VALIDATION_ERROR")
                    .message("Invalid request")
                    .build());
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<?> handleBusinessException(Exception ex) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.BAD_REQUEST)
                    .error("BUSINESS_ERROR")
                    .message(ex.getMessage())
                    .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        // Log error (never expose stack trace to client)
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .error("INTERNAL_SERVER_ERROR")
                    .message("An unexpected error occurred")
                    .build());
    }
}
```

## CORS Configuration

### API Gateway CORS
```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - name: CORS
          args:
            cors-config:
              allowed-origins:
                - "https://shopsphere.vercel.app"
                - "http://localhost:5173"
                - "http://localhost:3000"
              allowed-methods:
                - "GET"
                - "POST"
                - "PUT"
                - "DELETE"
                - "PATCH"
                - "OPTIONS"
              allowed-headers:
                - "Authorization"
                - "Content-Type"
                - "X-Requested-With"
              allow-credentials: true
              max-age: 3600
```

### CORS Best Practices
- **Origin**: Restrict to known domains, not `*` in production
- **Credentials**: `allow-credentials: true` only for trusted origins
- **Methods**: Limit to required HTTP methods
- **Headers**: Only allow required headers
- **Max-Age**: Cache preflight requests

## Security Headers

### Recommended Headers (via Filter)
```java
public class SecurityHeadersFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        httpResponse.setHeader("Content-Security-Policy", "default-src 'self'");
        
        chain.doFilter(request, response);
    }
}
```

## HTTPS & Network Security

### Enforce HTTPS
- **Redirect HTTP to HTTPS**: Middleware or load balancer config
- **HSTS**: HTTP Strict Transport Security
- **TLS 1.2+**: Only support modern TLS versions

### API Gateway HTTPS
```yaml
# Examplenginx configuration
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://auth-service:8081;
    }
}
```

### CSP (Content Security Policy)
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.shopsphere.com;
```

## Rate Limiting

### Gateway Rate Limiter
- **Default Limit**: 100 requests/minute per IP
- **Auth Endpoints**: 10 requests/minute per IP
- **Product Endpoints**: 60 requests/minute per IP
- **Order Endpoints**: 30 requests/minute per IP

### Rate Limit Response
```json
{
  "timestamp": "2024-01-15T10:30:00.123Z",
  "status": 429,
  "error": "TOO_MANY_REQUESTS",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "path": "/api/products",
  "retry-after": 60
}
```

## Security Headers Middleware

```java
@Component
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/products/**").authenticated()
                .anyRequest().denyAll()
            )
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers
                .frameOptions(HeadersConfig.FrameOptions.DENY)
                .contentSecurityPolicy(HeadersConfig.ContentSecurityPolicy.Builder
                    .defaultSrc("self")
                    .build())
                .httpPublicKeyPinning(HeadersConfig.HttpPublicKeyPinning.unsafe())
            );
        return http.build();
    }
}
```

## Data Security

### What Never to Log
- Passwords (plain or hashed)
- JWT secret keys
- Credit card numbers (even demo)
- Database connection strings
- Session IDs in URLs
- Personal customer data without mask

### Database Security
- **Schemas**: Each service owns its schema (auth_schema, product_schema, etc.)
- **No Cross-Service DB Access**: Services cannot query each other's tables
- **Connection Pool**: HikariCP with maximumPoolSize=10
- **Prepared Statements**: Prevent SQL injection
- **Parameterized Queries**: All JPA/Hibernate queries

### Password Policy enforcement
```java
@Configuration
public class PasswordPolicyConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // cost factor 12
    }
}
```

## Dependency Security

### Regular Updates
```bash
# Check for vulnerable dependencies
mvn dependency:check

# Update dependencies
mvn versions:use-latest-releases

# Dependency tree
mvn dependency:tree -Dincludes=io.jsonwebtoken:jjwt
```

### Dependency Verification
```bash
# Enforce dependency versions
mvn enforce

# Check for transitive dependencies
mvn dependency:list -Dverbose
```

## Security Testing

### Security Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
public class AuthSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    @Test
    public void testAuthenticationWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAuthenticationWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer invalid-token"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAuthorizationAsCustomer() throws Exception {
        mockMvc.perform(get("/api/admin/orders")
                .header("Authorization", "Bearer " + validAdminToken))
            .andExpect(status().isForbidden());
    }

    @Test
    public void testValidationErrors() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
            .andExpect(status().isBadRequest());
    }
}
```

### OWASP Top 10 Coverage
- **A01:2021 - Broken Access Control**: RBAC, endpoint security ✓
- **A02:2021 - Cryptographic Failures**: BCrypt, HTTPS, JWT ✓
- **A03:2021 - Injection**: Parameterized queries, input validation ✓
- **A04:2021 - Insecure Design**: Security by design, threat modeling ✓
- **A05:2021 - Security Misconfiguration**: CORS, headers, defaults ✓
- **A06:2021 - Vulnerable and Outdated Components**: Regular updates ✓
- **A07:2021-2023 - Identification and Authentication Failures**: JWT, BCrypt, session management ✓
- **A08:2021-2023 - Software and Data Integrity Failures**: Signature verification ✓
- **A09:2021-2023 - Security Logging and Monitoring Failures**: Audit logging ✓
- **A10:2021-2023 - Server-Side Request Forgery**: Input validation, URL validation ✓

## Compliance

### GDPR Considerations
- User data minimization
- Right to be forgotten (account deletion)
- Data retention policies
- Consent management for marketing

### PCI-DSS (Payment Processing)
- **Never store**: CVV, full card numbers
- **Demo mode only**: No real payment processing
- **Transaction references**: DEMO- prefixed, no real card data
- **Idempotency**: Prevent duplicate payment requests

### OWASP Compliance
- All security guidelines implemented
- Regular security reviews
- Dependency vulnerability scanning
- Security incident response plan

## Incident Response

### Security Breach Steps
1. **Identify**: Determine scope and impact
2. **Contain**: Isolate affected services
3. **Eradicate**: Remove vulnerability, rotate secrets
4. **Recover**: Restore from backup, monitor for re-occurrence
5. **Learn**: Document incident, improve protections

### Contact Security
- Report security issues to: security@shopsphere.com
- Response time: 48 hours for initial acknowledgment
- Vulnerability disclosure policy available in README

## Security Checklist

### Before Deployment
- [ ] JWT secret is strong and not hardcoded
- [ ] BCrypt encoder configured with appropriate cost factor
- [ ] CORS restricted to production origins
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting configured
- [ ] Security headers configured
- [ ] No secrets in Docker images
- [ ] Environment variables documented in .env.example
- [ ] Dependencies updated and verified
- [ ] Security tests passing
- [ ] No passwords in logs
- [ ] CORS configuration reviewed
- [ ] Input validation on all endpoints
- [ ] Error handling standardized (no stack traces to clients)
- [ ] Database schemas properly isolated
- [ ] RBAC implemented and tested

### After Deployment
- [ ] Monitor security logs
- [ ] Set up alerting for suspicious activity
- [ ] Regular dependency scanning
- [ ] Certificate renewal schedule
- [ ] Log retention policy
- [ ] Backup verification