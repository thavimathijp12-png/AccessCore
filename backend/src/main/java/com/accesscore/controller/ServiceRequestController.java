package com.accesscore.controller;

import com.accesscore.entity.ServiceRequest;
import com.accesscore.repository.ServiceRequestRepository;
import com.accesscore.util.WorkflowStatusValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestRepository requestRepository;

    public ServiceRequestController(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        return ResponseEntity.ok(requestRepository.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<ServiceRequest> getRequestByCode(@PathVariable String code) {
        return requestRepository.findByRequestCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceRequest> createRequest(@NonNull @RequestBody ServiceRequest request) {
        if (request.getRequestCode() == null || request.getRequestCode().isEmpty()) {
            long count = requestRepository.count() + 1;
            request.setRequestCode(String.format("REQ-%04d", count));
        }
        if (request.getStatus() == null) {
            request.setStatus("New");
        }
        ServiceRequest saved = requestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        String newStatus = WorkflowStatusValidator.validateRequestStatus(payload.get("status"));
        return requestRepository.findByRequestCode(code).<ResponseEntity<ServiceRequest>>map((@NonNull ServiceRequest req) -> {
            req.setStatus(newStatus);
            if (payload.containsKey("rejectionReason")) {
                req.setRejectionReason(payload.get("rejectionReason"));
            }
            if (payload.containsKey("cancellationReason")) {
                req.setCancellationReason(payload.get("cancellationReason"));
            }
            ServiceRequest saved = requestRepository.save(req);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRequest(@PathVariable String code) {
        return requestRepository.findByRequestCode(code).<ResponseEntity<Void>>map((@NonNull ServiceRequest req) -> {
            requestRepository.delete(req);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
