package com.insuranceagent.lead;

import jakarta.validation.constraints.NotBlank;

public record LeadNoteCreateRequest(
        @NotBlank(message = "Content is required")
        String content,

        String author
) {
}
