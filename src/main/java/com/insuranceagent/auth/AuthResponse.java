package com.insuranceagent.auth;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        UUID userId,
        String username,
        Role role
) {
    public AuthResponse(String token, UUID userId, String username, Role role) {
        this(token, "Bearer", userId, username, role);
    }
}
