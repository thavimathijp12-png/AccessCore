package com.accesscore.repository;

import com.accesscore.entity.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
    Optional<TaskItem> findByTaskCode(String taskCode);
    List<TaskItem> findByStatus(String status);
    List<TaskItem> findByAssignee(String assignee);
    List<TaskItem> findByReporter(String reporter);

    @Query("""
            SELECT t FROM TaskItem t
            WHERE (:status IS NULL OR LOWER(t.status) = LOWER(:status))
              AND (:priority IS NULL OR LOWER(t.priority) = LOWER(:priority))
              AND (:assignee IS NULL OR LOWER(t.assignee) = LOWER(:assignee))
              AND (:department IS NULL OR LOWER(t.department) = LOWER(:department))
            """)
    List<TaskItem> findFiltered(
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("assignee") String assignee,
            @Param("department") String department);
}
