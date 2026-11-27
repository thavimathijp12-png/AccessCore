package com.accesscore.repository;

import com.accesscore.entity.BugReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Long> {
    Optional<BugReport> findByBugCode(String bugCode);
    List<BugReport> findByStatus(String status);
    List<BugReport> findBySeverity(String severity);
    List<BugReport> findByAssignedTo(String assignedTo);

    @Query("""
            SELECT b FROM BugReport b
            WHERE (:status IS NULL OR LOWER(b.status) = LOWER(:status))
              AND (:severity IS NULL OR LOWER(b.severity) = LOWER(:severity))
              AND (:environment IS NULL OR LOWER(b.environment) = LOWER(:environment))
              AND (:assignedTo IS NULL OR LOWER(b.assignedTo) = LOWER(:assignedTo))
            """)
    List<BugReport> findFiltered(
            @Param("status") String status,
            @Param("severity") String severity,
            @Param("environment") String environment,
            @Param("assignedTo") String assignedTo);
}
