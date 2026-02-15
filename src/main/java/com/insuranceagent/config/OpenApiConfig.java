package com.insuranceagent.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Insurance AI Sales Agent API")
                        .description("API for managing insurance leads, products, and AI-powered sales")
                        .version("1.0.0"));
    }
}
