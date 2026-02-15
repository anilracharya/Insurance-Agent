package com.insuranceagent.product;

import jakarta.validation.constraints.NotBlank;

public record ProductCategoryCreateRequest(
        @NotBlank String name,
        String description
) {
}
