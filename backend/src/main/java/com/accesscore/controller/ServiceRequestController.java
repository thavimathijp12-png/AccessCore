package com.accesscore.controller;

import com.accesscore.dto.CreateServiceRequestDto;
import com.accesscore.dto.StatusUpdateRequest;
import com.accesscore.entity.ServiceRequest;
import com.accesscore.repository.ServiceRequestRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ServiceRequest> createRequest(@Valid @RequestBody CreateServiceRequestDto dto) {
        String requestCode = dto.getRequestCode();
        if (requestCode == null || requestCode.isBlank()) {
            long count = requestRepository.count() + 1;
            requestCode = String.format("REQ-%04d", count);
        }
        String status = (dto.getStatus() == null || dto.getStatus().isBlank()) ? "New" : dto.getStatus();

        ServiceRequest request = new ServiceRequest(
                requestCode,
                dto.getTitle().trim(),
                dto.getCategory().trim(),
                dto.getPriority().trim(),
                status,
                dto.getDepartment().trim(),
                dto.getDescription().trim(),
                dto.getAssignedTo(),
                dto.getCreatedBy().trim()
        );
        ServiceRequest saved = requestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable String code, @Valid @RequestBody StatusUpdateRequest payload) {
        return requestRepository.findByRequestCode(code).<ResponseEntity<ServiceRequest>>map((@NonNull ServiceRequest req) -> {
            req.setStatus(payload.getStatus().trim());
            if (payload.getRejectionReason() != null) {
                req.setRejectionReason(payload.getRejectionReason());
            }
            if (payload.getCancellationReason() != null) {
                req.setCancellationReason(payload.getCancellationReason());
            } else if (payload.getReason() != null) {
                req.setCancellationReason(payload.getReason());
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
