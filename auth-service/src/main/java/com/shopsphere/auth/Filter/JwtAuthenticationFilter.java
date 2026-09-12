package com.shopsphere.auth.Filter;

import com.shopsphere.auth.Entity.User;
import com.shopsphere.auth.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = getJwtFromRequest(request);

        if (jwt != null && !jwt.isEmpty()) {
            try {
                // Parse the token and extract username
                String userEmail = Jwts.parser()
                        .setSigningKey(java.lang.String.valueOf(secret.getBytes()))
                        .parseClaimsJws(jwt)
                        .getBody()
                        .getSubject();

                if (userEmail != null) {
                    User user = userRepository.findByEmail(userEmail)
                            .orElse(null);

                    if (user != null) {
                        org.springframework.security.core.userdetails.User userDetails =
                                new org.springframework.security.core.userdetails.User(
                                        user.getEmail(),
                                        user.getPasswordHash(),
                                        user.getRole() == User.Role.ADMIN
                                                ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                                                : List.of(new SimpleGrantedAuthority("ROLE_USER"))
                                );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Token validation failed, continue without setting authentication
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }

        // Also check cookie
        String jwtCookie = request.getHeader("Cookie");
        if (jwtCookie != null) {
            String[] cookies = jwtCookie.split("; ");
            for (String cookie : cookies) {
                if (cookie.startsWith("Authorization=")) {
                    return cookie.substring("Authorization=".length());
                }
            }
        }

        return null;
    }
}