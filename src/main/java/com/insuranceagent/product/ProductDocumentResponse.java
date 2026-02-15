package com.insuranceagent.product;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProductDocumentResponse(
        UUID id,
        UUID productId,
        String fileName,
        String fileUrl,
        String documentType,
        LocalDateTime createdAt
) {
}
