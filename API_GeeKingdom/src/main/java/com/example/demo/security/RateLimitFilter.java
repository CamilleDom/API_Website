package com.example.demo.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();

    // Limite : 100 requêtes par minute (augmenté pour le développement)
    private static final int MAX_REQUESTS = 100;
    private static final long TIME_WINDOW_MS = 60_000L;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // Ignorer les requêtes OPTIONS (preflight CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // Ignorer certains endpoints publics
        String path = request.getRequestURI();
        if (path.startsWith("/auth/") || path.equals("/")) {
            chain.doFilter(request, response);
            return;
        }

        String ip = getClientIP(request);
        Deque<Long> deque = requests.computeIfAbsent(ip, k -> new ArrayDeque<>());

        long now = System.currentTimeMillis();

        // Supprimer les timestamps plus vieux qu'une minute
        synchronized (deque) {
            while (!deque.isEmpty() && deque.peekFirst() < now - TIME_WINDOW_MS) {
                deque.pollFirst();
            }

            // Vérifier si la limite est dépassée
            if (deque.size() >= MAX_REQUESTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                response.getWriter().write("{\"error\": \"Too Many Requests. Please try again later.\"}");
                return;
            }

            deque.addLast(now);
        }

        chain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}