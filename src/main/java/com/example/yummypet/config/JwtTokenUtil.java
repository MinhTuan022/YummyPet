//package com.example.yummypet.config;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//
//@Component
//public class JwtTokenUtil {
//
//    @Value("${spring.security.jwt.secret}")
//    private String secret;
//
//    @Value("${spring.security.jwt.expiration}")
//    private Long expiration;
//
//    private SecretKey getSignKey() {
//        return Keys.hmacShaKeyFor(secret.getBytes());
//    }
//
//    public String generateToken(String username, String role) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("role", role);
//        return createToken(claims, username);
//    }
//
//    private String createToken(Map<String, Object> claims, String subject) {
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(subject)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(getSignKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    public String extractRole(String token) {
//        return extractClaim(token, claims -> claims.get("role", String.class));
//    }
//
//    public Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.resolve(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(getSignKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    private Boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    public Boolean validateToken(String token, String username) {
//        final String tokenUsername = extractUsername(token);
//        return (tokenUsername.equals(username) && !isTokenExpired(token));
//    }
//
//    @FunctionalInterface
//    public interface ClaimsResolver<T> {
//        T resolve(Claims claims);
//    }
//}
