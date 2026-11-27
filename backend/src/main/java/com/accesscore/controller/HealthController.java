package com.accesscore.controller;

import com.accesscore.dto.HealthResponse;
import com.accesscore.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "Service and database health check")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/health")
    @Operation(summary = "Check backend and database health")
    public ResponseEntity<HealthResponse> checkHealth() {
        boolean dbUp = healthService.isDatabaseUp();
        HealthResponse response = new HealthResponse(
                dbUp ? "UP" : "DEGRADED",
                "ACCESSCORE Backend",
                "Backend is running successfully",
                dbUp ? "UP" : "DOWN"
        );
        return ResponseEntity.ok(response);
    }
}
