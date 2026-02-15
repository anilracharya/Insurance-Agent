package com.insuranceagent.calendar;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CalendarSlotCreateRequest(
        @NotBlank String agentId,
        @NotNull LocalDateTime startTime,
        @NotNull LocalDateTime endTime,
        String title,
        String notes
) {
}
