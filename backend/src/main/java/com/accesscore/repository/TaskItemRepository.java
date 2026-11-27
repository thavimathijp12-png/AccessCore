package com.accesscore.repository;

import com.accesscore.entity.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
    Optional<TaskItem> findByTaskCode(String taskCode);
    boolean existsByTaskCode(String taskCode);
    List<TaskItem> findByStatus(String status);
    List<TaskItem> findByAssignee(String assignee);
    List<TaskItem> findByReporter(String reporter);
}
