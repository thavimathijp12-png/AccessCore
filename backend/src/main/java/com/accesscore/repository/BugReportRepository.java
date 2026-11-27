package com.accesscore.repository;

import com.accesscore.entity.BugReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Long> {
    Optional<BugReport> findByBugCode(String bugCode);
    boolean existsByBugCode(String bugCode);
    List<BugReport> findByStatus(String status);
    List<BugReport> findBySeverity(String severity);
    List<BugReport> findByAssignedTo(String assignedTo);
}
