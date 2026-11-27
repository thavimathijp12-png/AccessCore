package com.accesscore.controller;

import com.accesscore.entity.TaskItem;
import com.accesscore.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskItem>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{code}")
    public ResponseEntity<TaskItem> getTaskByCode(@PathVariable String code) {
        return taskService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<TaskItem> createTask(@NonNull @RequestBody TaskItem task) {
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<TaskItem> updateTaskStatus(@PathVariable String code,
            @NonNull @RequestBody Map<String, String> payload) {
        return taskService.updateStatus(code, payload.get("status"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable String code) {
        return taskService.deleteByCode(code)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}
