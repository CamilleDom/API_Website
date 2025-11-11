package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.util.Collections;

@Component
@Order(1) // Donne une priorité (plus petit = plus prioritaire)
public class ApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY = "API Key 5IrdIsm-NOx9MmiXHzp732eT7Si9aGy4hoi0ocPTBKoGWU7-FJHrQQ3zgVHblIeER2atzUQqbiErCQjRw89xWg-YP6kBgZE982fyXAnSUMGlKNeDTlSWP0ljjDxI6bu7FsExMf20iCCHIMiiHYQ6X5EaAuSLjEe3KY_8DOohptLmJSXLkQeLYP4uuYJblki2MDzpPI28YT0P5-OPZW3cpZA0WWZQXalBvLFqV52hs7pECHItxTMBISEcUsyBxKXI";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.equals(API_KEY)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized: Invalid API Key\"}");
            return;
        }

        // Clé API valide : on crée un objet Authentication et on le place dans le contexte Spring Security
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken("apiKeyUser", null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
