package com.insuranceagent.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProductCreateRequest(
        @NotBlank String name,
        String description,
        @NotNull UUID categoryId,
        String premiumRange,
        String coverageAmount,
        String features
) {
}
