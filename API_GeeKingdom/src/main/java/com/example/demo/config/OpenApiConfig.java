package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI geeKingdomOpenAPI() {
        SecurityScheme jwtScheme = new SecurityScheme()
                .name("JWT")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        SecurityScheme apiKeyScheme = new SecurityScheme()
                .name("API Key")
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER);

        return new OpenAPI()
                .info(new Info()
                        .title("GeeKingdom E-Commerce API")
                        .description("API REST pour la plateforme e-commerce GeeKingdom")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Équipe GeeKingdom")
                                .email("support@geekingdom.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Dev"),
                        new Server().url("https://api.geekingdom.com").description("Prod")))
                .components(new Components()
                        .addSecuritySchemes("JWT", jwtScheme)
                        .addSecuritySchemes("API Key", apiKeyScheme));
    }
}