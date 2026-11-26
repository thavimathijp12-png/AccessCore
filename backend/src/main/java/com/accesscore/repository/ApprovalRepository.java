package com.accesscore.repository;

import com.accesscore.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    Optional<Approval> findByApprovalCode(String approvalCode);
    List<Approval> findByStatus(String status);
    List<Approval> findByRequestor(String requestor);
    List<Approval> findByDepartment(String department);
}
