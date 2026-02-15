package com.insuranceagent.product;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        UUID categoryId,
        String categoryName,
        String premiumRange,
        String coverageAmount,
        String features,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
