package com.accesscore.controller;

import com.accesscore.entity.ServiceRequest;
import com.accesscore.service.ServiceRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        return ResponseEntity.ok(serviceRequestService.getAllRequests());
    }

    @GetMapping("/{code}")
    public ResponseEntity<ServiceRequest> getRequestByCode(@PathVariable String code) {
        return serviceRequestService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceRequest> createRequest(@NonNull @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceRequestService.createRequest(request));
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        return serviceRequestService.updateStatus(code, payload)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRequest(@PathVariable String code) {
        return serviceRequestService.deleteByCode(code)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}
