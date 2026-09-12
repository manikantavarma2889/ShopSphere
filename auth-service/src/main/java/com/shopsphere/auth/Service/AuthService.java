package com.shopsphere.auth.Service;

import com.shopsphere.auth.Entity.User;
import com.shopsphere.auth.Entity.User.Role;
import com.shopsphere.auth.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.jsonwebtoken.Claims;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String secret;

    private Key signingKey;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    @Transactional
    public User register(String firstName, String lastName, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(firstName, lastName, email, encodedPassword, Role.CUSTOMER);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("Account is disabled");
        }

        return user;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(System.currentTimeMillis() + jwtExpiration());

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String refreshToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            User user = getUserFromToken(token);
            return generateToken(user);
        }
        return null;
    }

    public User getUserFromToken(String token) {
        String email = extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private long jwtExpiration() {
        return Long.parseLong(java.util.Optional.ofNullable(secret)
                .orElse("86400000")
                .replace("ms", ""));
    }

    @Transactional
    public User updateProfile(Long userId, String firstName, String lastName, String email) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getEmail() != null && !user.getEmail().equals(email) &&
                userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use: " + email);
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public void logout(HttpServletRequest request) {
        // In a stateless JWT system, logout is handled client-side
        // by removing the token from local storage
    }

    public boolean isTokenValid(String token, User user) {
        final String email = extractEmail(token);
        return (email.equals(user.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiry(token).before(new Date());
    }

    private Date extractExpiry(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}