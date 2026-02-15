package com.insuranceagent.lead;

import java.time.LocalDateTime;
import java.util.UUID;

public record LeadResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phone,
        LeadStatus status,
        String source,
        String assignedAgent,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
