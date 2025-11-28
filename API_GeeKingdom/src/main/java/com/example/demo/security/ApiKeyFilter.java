package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    private static final String API_KEY = "API_Key_5IrdIsm-NOx9MmiXHzp732eT7Si9aGy4hoi0ocPTBKoGWU7-FJHrQQ3zgVHblIeER2atzUQqbiErCQjRw89xWg-YP6kBgZE982fyXAnSUMGlKNeDTlSWP0ljjDxI6bu7FsExMf20iCCHIMiiHYQ6X5EaAuSLjEe3KY_8DOohptLmJSXLkQeLYP4uuYJblki2MDzpPI28YT0P5-OPZW3cpZA0WWZQXalBvLFqV52hs7pECHItxTMBISEcUsyBxKXI";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ ApiKeyFilter s'applique UNIQUEMENT aux endpoints /api/admin/* ou /api/external/*
        // Tous les autres endpoints passent sans vérification de l'API Key
        if (!path.startsWith("/api/admin") && !path.startsWith("/api/external")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Vérification de l'API Key pour les endpoints protégés
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.equals(API_KEY)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            response.getWriter().write("{\"error\": \"Unauthorized: Invalid API Key\"}");
            return;
        }

        // Clé API valide : créer un objet Authentication
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken("apiKeyUser", null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}