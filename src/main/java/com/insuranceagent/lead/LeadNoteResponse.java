package com.insuranceagent.lead;

import java.time.LocalDateTime;
import java.util.UUID;

public record LeadNoteResponse(
        UUID id,
        UUID leadId,
        String content,
        String author,
        LocalDateTime createdAt
) {
}
