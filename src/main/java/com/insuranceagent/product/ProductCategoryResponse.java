package com.insuranceagent.product;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductCategoryResponse(
        UUID id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
