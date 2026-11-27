package com.accesscore.repository;

import com.accesscore.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    Optional<Approval> findByApprovalCode(String approvalCode);
    List<Approval> findByStatus(String status);
    List<Approval> findByRequestor(String requestor);
    List<Approval> findByDepartment(String department);

    @Query("""
            SELECT a FROM Approval a
            WHERE (:status IS NULL OR LOWER(a.status) = LOWER(:status))
              AND (:priority IS NULL OR LOWER(a.priority) = LOWER(:priority))
              AND (:department IS NULL OR LOWER(a.department) = LOWER(:department))
            """)
    List<Approval> findFiltered(
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("department") String department);
}
