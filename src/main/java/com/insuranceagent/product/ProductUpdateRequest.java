package com.insuranceagent.product;

import java.util.UUID;

public record ProductUpdateRequest(
        String name,
        String description,
        UUID categoryId,
        String premiumRange,
        String coverageAmount,
        String features,
        Boolean active
) {
}
