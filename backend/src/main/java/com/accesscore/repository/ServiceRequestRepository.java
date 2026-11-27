package com.accesscore.repository;

import com.accesscore.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Optional<ServiceRequest> findByRequestCode(String requestCode);
    boolean existsByRequestCode(String requestCode);
    List<ServiceRequest> findByStatus(String status);
    List<ServiceRequest> findByDepartment(String department);
    List<ServiceRequest> findByCreatedBy(String createdBy);
    List<ServiceRequest> findByAssignedTo(String assignedTo);
}
