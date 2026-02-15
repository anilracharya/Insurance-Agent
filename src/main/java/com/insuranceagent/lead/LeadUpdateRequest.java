package com.insuranceagent.lead;

public record LeadUpdateRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        LeadStatus status,
        String source,
        String assignedAgent,
        String notes
) {
}
