package com.insuranceagent.product;

import jakarta.validation.constraints.NotBlank;

public record ProductDocumentCreateRequest(
        @NotBlank String fileName,
        @NotBlank String fileUrl,
        String documentType
) {
}
