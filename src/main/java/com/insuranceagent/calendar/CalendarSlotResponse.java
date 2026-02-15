package com.insuranceagent.calendar;

import java.time.LocalDateTime;
import java.util.UUID;

public record CalendarSlotResponse(
        UUID id,
        String agentId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        boolean booked,
        UUID leadId,
        String title,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
