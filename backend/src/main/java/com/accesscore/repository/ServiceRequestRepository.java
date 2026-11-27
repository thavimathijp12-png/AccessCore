package com.accesscore.repository;

import com.accesscore.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Optional<ServiceRequest> findByRequestCode(String requestCode);
    List<ServiceRequest> findByStatus(String status);
    List<ServiceRequest> findByDepartment(String department);
    List<ServiceRequest> findByCreatedBy(String createdBy);
    List<ServiceRequest> findByAssignedTo(String assignedTo);

    @Query("""
            SELECT r FROM ServiceRequest r
            WHERE (:status IS NULL OR LOWER(r.status) = LOWER(:status))
              AND (:priority IS NULL OR LOWER(r.priority) = LOWER(:priority))
              AND (:department IS NULL OR LOWER(r.department) = LOWER(:department))
              AND (:assignedTo IS NULL OR LOWER(r.assignedTo) = LOWER(:assignedTo))
            """)
    List<ServiceRequest> findFiltered(
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("department") String department,
            @Param("assignedTo") String assignedTo);
}
