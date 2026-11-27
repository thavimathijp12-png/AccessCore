package com.accesscore.controller;

import com.accesscore.dto.CreateTaskDto;
import com.accesscore.dto.StatusUpdateRequest;
import com.accesscore.entity.TaskItem;
import com.accesscore.repository.TaskItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskItemRepository taskRepository;

    public TaskController(TaskItemRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public ResponseEntity<List<TaskItem>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<TaskItem> getTaskByCode(@PathVariable String code) {
        return taskRepository.findByTaskCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<TaskItem> createTask(@Valid @RequestBody CreateTaskDto dto) {
        String taskCode = dto.getTaskCode();
        if (taskCode == null || taskCode.isBlank()) {
            long count = taskRepository.count() + 1001;
            taskCode = String.format("TSK-%04d", count);
        }
        String status = (dto.getStatus() == null || dto.getStatus().isBlank()) ? "TODO" : dto.getStatus();

        TaskItem task = new TaskItem(
                taskCode,
                dto.getTitle().trim(),
                dto.getDescription(),
                status,
                dto.getPriority().trim(),
                dto.getAssignee(),
                dto.getReporter(),
                dto.getDepartment()
        );
        task.setDueDate(dto.getDueDate());

        TaskItem saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<TaskItem> updateTaskStatus(@PathVariable String code,
            @Valid @RequestBody StatusUpdateRequest payload) {
        TaskItem task = taskRepository.findByTaskCode(code).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        task.setStatus(payload.getStatus().trim());
        TaskItem saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable String code) {
        TaskItem task = taskRepository.findByTaskCode(code).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.delete(task);
        return ResponseEntity.ok().build();
    }
}
