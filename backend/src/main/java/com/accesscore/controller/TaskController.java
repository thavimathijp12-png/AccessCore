package com.accesscore.controller;

import com.accesscore.entity.TaskItem;
import com.accesscore.repository.TaskItemRepository;
import com.accesscore.util.EntityCodeGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskItemRepository taskRepository;
    private final EntityCodeGenerator codeGenerator;

    public TaskController(TaskItemRepository taskRepository, EntityCodeGenerator codeGenerator) {
        this.taskRepository = taskRepository;
        this.codeGenerator = codeGenerator;
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
    public ResponseEntity<TaskItem> createTask(@NonNull @RequestBody TaskItem task) {
        if (task.getTaskCode() == null || task.getTaskCode().isEmpty()) {
            List<String> existingCodes = taskRepository.findAll().stream()
                    .map(TaskItem::getTaskCode)
                    .collect(Collectors.toList());
            task.setTaskCode(codeGenerator.nextCode("TSK", 4, 1001, existingCodes, taskRepository::existsByTaskCode));
        }
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        TaskItem saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<TaskItem> updateTaskStatus(@PathVariable String code,
            @NonNull @RequestBody Map<String, String> payload) {
        TaskItem task = taskRepository.findByTaskCode(code).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        String newStatus = payload.get("status");
        if (newStatus != null) {
            task.setStatus(newStatus);
        }
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
