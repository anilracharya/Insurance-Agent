package com.insuranceagent.auth;

import java.time.LocalDateTime;
import java.util.UUID;

public record AgentResponse(
        UUID id,
        String username,
        String email,
        String fullName,
        Role role,
        LocalDateTime createdAt
) {}
