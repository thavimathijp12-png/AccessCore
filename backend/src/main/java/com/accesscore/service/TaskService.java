package com.accesscore.service;

import com.accesscore.entity.TaskItem;
import com.accesscore.repository.TaskItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskItemRepository taskRepository;

    public TaskService(TaskItemRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskItem> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TaskItem> getByCode(String code) {
        return taskRepository.findByTaskCode(code);
    }

    @Transactional
    public TaskItem createTask(TaskItem task) {
        if (task.getTaskCode() == null || task.getTaskCode().isEmpty()) {
            long count = taskRepository.count() + 1001;
            task.setTaskCode(String.format("TSK-%04d", count));
        }
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        return taskRepository.save(task);
    }

    @Transactional
    public Optional<TaskItem> updateStatus(String code, String newStatus) {
        return taskRepository.findByTaskCode(code).map(task -> {
            if (newStatus != null) {
                task.setStatus(newStatus);
            }
            return taskRepository.save(task);
        });
    }

    @Transactional
    public boolean deleteByCode(String code) {
        Optional<TaskItem> existing = taskRepository.findByTaskCode(code);
        if (existing.isEmpty()) {
            return false;
        }
        taskRepository.delete(existing.get());
        return true;
    }
}
