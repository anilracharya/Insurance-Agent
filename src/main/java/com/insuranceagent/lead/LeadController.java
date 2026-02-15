package com.insuranceagent.lead;

import com.insuranceagent.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
@Tag(name = "Leads", description = "Lead management endpoints")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    @Operation(summary = "Create a new lead", description = "Creates a new lead with the provided details")
    public ResponseEntity<ApiResponse<LeadResponse>> createLead(@Valid @RequestBody LeadCreateRequest request) {
        LeadResponse response = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lead created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all leads", description = "Retrieves a list of all leads")
    public ResponseEntity<ApiResponse<List<LeadResponse>>> getAllLeads() {
        List<LeadResponse> responses = leadService.getAllLeads();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead by ID", description = "Retrieves a specific lead by its ID")
    public ResponseEntity<ApiResponse<LeadResponse>> getLeadById(@PathVariable UUID id) {
        LeadResponse response = leadService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a lead", description = "Updates an existing lead with the provided details")
    public ResponseEntity<ApiResponse<LeadResponse>> updateLead(@PathVariable UUID id,
                                                                 @Valid @RequestBody LeadUpdateRequest request) {
        LeadResponse response = leadService.updateLead(id, request);
        return ResponseEntity.ok(ApiResponse.success("Lead updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lead", description = "Deletes a lead by its ID")
    public ResponseEntity<Void> deleteLead(@PathVariable UUID id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get leads by status", description = "Retrieves all leads with the specified status")
    public ResponseEntity<ApiResponse<List<LeadResponse>>> getLeadsByStatus(@PathVariable LeadStatus status) {
        List<LeadResponse> responses = leadService.getLeadsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/{id}/notes")
    @Operation(summary = "Add a note to a lead", description = "Creates a new note attached to the specified lead")
    public ResponseEntity<ApiResponse<LeadNoteResponse>> addNote(@PathVariable UUID id,
                                                                  @Valid @RequestBody LeadNoteCreateRequest request) {
        LeadNoteResponse response = leadService.addNote(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Note added successfully", response));
    }

    @GetMapping("/{id}/notes")
    @Operation(summary = "Get notes for a lead", description = "Retrieves all notes for the specified lead, ordered by most recent first")
    public ResponseEntity<ApiResponse<List<LeadNoteResponse>>> getNotes(@PathVariable UUID id) {
        List<LeadNoteResponse> responses = leadService.getNotes(id);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
