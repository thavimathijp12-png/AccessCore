package com.accesscore.service;

import com.accesscore.entity.ServiceRequest;
import com.accesscore.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;

    public ServiceRequestService(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<ServiceRequest> getByCode(String code) {
        return requestRepository.findByRequestCode(code);
    }

    @Transactional
    public ServiceRequest createRequest(ServiceRequest request) {
        if (request.getRequestCode() == null || request.getRequestCode().isEmpty()) {
            long count = requestRepository.count() + 1;
            request.setRequestCode(String.format("REQ-%04d", count));
        }
        if (request.getStatus() == null) {
            request.setStatus("New");
        }
        return requestRepository.save(request);
    }

    @Transactional
    public Optional<ServiceRequest> updateStatus(String code, Map<String, String> payload) {
        return requestRepository.findByRequestCode(code).map(req -> {
            String newStatus = payload.get("status");
            if (newStatus != null) {
                req.setStatus(newStatus);
            }
            if (payload.containsKey("rejectionReason")) {
                req.setRejectionReason(payload.get("rejectionReason"));
            }
            if (payload.containsKey("cancellationReason")) {
                req.setCancellationReason(payload.get("cancellationReason"));
            }
            return requestRepository.save(req);
        });
    }

    @Transactional
    public boolean deleteByCode(String code) {
        Optional<ServiceRequest> existing = requestRepository.findByRequestCode(code);
        if (existing.isEmpty()) {
            return false;
        }
        requestRepository.delete(existing.get());
        return true;
    }
}
