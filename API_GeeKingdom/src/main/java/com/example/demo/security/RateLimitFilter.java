package com.example.demo.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    // Map pour stocker les requêtes par IP
    private final Map<String, Deque<Long>> requests = new ConcurrentHashMap<>();

    // Limite : 5 requêtes par minute
    private static final int MAX_REQUESTS = 5;
    private static final long TIME_WINDOW_MS = 60_000L; // 1 minute en ms

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String ip = request.getRemoteAddr(); // Récupération de l'adresse IP

        // Récupérer la deque pour l'IP, ou en créer une nouvelle si elle n'existe pas
        Deque<Long> deque = requests.computeIfAbsent(ip, k -> new ArrayDeque<>());

        long now = System.currentTimeMillis();

        // Supprimer les timestamps plus vieux qu'une minute
        while (!deque.isEmpty() && deque.peekFirst() < now - TIME_WINDOW_MS) {
            deque.pollFirst();
        }

        // Vérifier si la limite est dépassée
        if (deque.size() >= MAX_REQUESTS) {
            response.setStatus(429);
            response.getWriter().write("Too Many Requests");
            return;
        }

        // Ajouter le timestamp actuel
        deque.addLast(now);

        // Continuer la chaîne de filtres
        chain.doFilter(request, response);
    }
}
