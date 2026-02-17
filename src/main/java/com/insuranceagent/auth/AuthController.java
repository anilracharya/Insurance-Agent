package com.insuranceagent.auth;

import com.insuranceagent.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/api/v1/auth/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/api/v1/admin/agents")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new agent (admin only)")
    public ResponseEntity<ApiResponse<AgentResponse>> createAgent(@Valid @RequestBody RegisterRequest request) {
        AgentResponse response = authService.createAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Agent created successfully", response));
    }

    @GetMapping("/api/v1/admin/agents")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all agents (admin only)")
    public ResponseEntity<ApiResponse<List<AgentResponse>>> listAgents() {
        List<AgentResponse> agents = authService.listAgents();
        return ResponseEntity.ok(ApiResponse.success(agents));
    }

    @DeleteMapping("/api/v1/admin/agents/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an agent (admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteAgent(@PathVariable UUID id) {
        authService.deleteAgent(id);
        return ResponseEntity.ok(ApiResponse.success("Agent deleted successfully", null));
    }
}
