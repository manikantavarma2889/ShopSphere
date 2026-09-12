package com.shopsphere.auth.Controller;

import com.shopsphere.auth.Entity.User;
import com.shopsphere.auth.Entity.User.Role;
import com.shopsphere.auth.Service.AuthService;
import io.jsonwebtoken.Jwt;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String firstName,
                                      @RequestParam String lastName,
                                      @RequestParam String email,
                                      @RequestParam String password) {
        try {
            User user = authService.register(firstName, lastName, email, password);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("{\"message\": \"User registered successfully\", \"userId\": " + user.getId() + "}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,
                                   @RequestParam String password,
                                   HttpServletResponse response) {
        try {
            User user = authService.login(email, password);
            String token = authService.generateToken(user);
            // Set token in HTTP-only cookie
            String jwtCookie = "Authorization=Bearer " + token + "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" + (24 * 60 * 60);
            response.setHeader("Set-Cookie", jwtCookie);

            return ResponseEntity.ok()
                    .body("{\"message\": \"Login successful\", \"token\": \"" + token + "\"}");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            User user = authService.getUserFromToken(token);
            if (user != null) {
                return ResponseEntity.ok()
                        .body("{\"id\": " + user.getId() +
                                ", \"firstName\": \"" + user.getFirstName() + "\"" +
                                ", \"lastName\": \"" + user.getLastName() + "\"" +
                                ", \"email\": \"" + user.getEmail() + "\"" +
                                ", \"role\": \"" + user.getRole() + "\"}");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"Invalid or missing token\"}");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam Long userId,
                                          @RequestParam(required = false) String firstName,
                                          @RequestParam(required = false) String lastName,
                                          @RequestParam(required = false) String email,
                                          HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Missing authorization header\"}");
        }

        String token = bearerToken.substring(7);
        try {
            User user = authService.updateProfile(userId, firstName, lastName, email);
            return ResponseEntity.ok()
                    .body("{\"message\": \"Profile updated successfully\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Clear the JWT cookie
        String clearCookie = "Authorization=Bearer; Path=/; HttpOnly; SameSite=Strict; Max-Age=0";
        response.setHeader("Set-Cookie", clearCookie);

        return ResponseEntity.ok()
                .body("{\"message\": \"Logged out successfully\"}");
    }
}