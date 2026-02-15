package com.insuranceagent.calendar;

import java.time.LocalDateTime;
import java.util.UUID;

public record CalendarSlotUpdateRequest(
        String agentId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Boolean booked,
        UUID leadId,
        String title,
        String notes
) {
}
