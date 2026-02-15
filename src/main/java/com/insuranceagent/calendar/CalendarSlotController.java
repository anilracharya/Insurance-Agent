package com.insuranceagent.calendar;

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
@RequestMapping("/api/v1/calendar/slots")
@Tag(name = "Calendar")
public class CalendarSlotController {

    private final CalendarSlotService calendarSlotService;

    public CalendarSlotController(CalendarSlotService calendarSlotService) {
        this.calendarSlotService = calendarSlotService;
    }

    @PostMapping
    @Operation(summary = "Create a new calendar slot")
    public ResponseEntity<ApiResponse<CalendarSlotResponse>> createSlot(
            @Valid @RequestBody CalendarSlotCreateRequest request) {
        CalendarSlotResponse response = calendarSlotService.createSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Calendar slot created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all calendar slots")
    public ResponseEntity<ApiResponse<List<CalendarSlotResponse>>> getAllSlots() {
        List<CalendarSlotResponse> responses = calendarSlotService.getAllSlots();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a calendar slot by ID")
    public ResponseEntity<ApiResponse<CalendarSlotResponse>> getSlotById(@PathVariable UUID id) {
        CalendarSlotResponse response = calendarSlotService.getSlotById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a calendar slot")
    public ResponseEntity<ApiResponse<CalendarSlotResponse>> updateSlot(
            @PathVariable UUID id,
            @RequestBody CalendarSlotUpdateRequest request) {
        CalendarSlotResponse response = calendarSlotService.updateSlot(id, request);
        return ResponseEntity.ok(ApiResponse.success("Calendar slot updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a calendar slot")
    public ResponseEntity<Void> deleteSlot(@PathVariable UUID id) {
        calendarSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available (unbooked) calendar slots")
    public ResponseEntity<ApiResponse<List<CalendarSlotResponse>>> getAvailableSlots() {
        List<CalendarSlotResponse> responses = calendarSlotService.getAvailableSlots();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
