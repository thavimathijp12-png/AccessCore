package com.accesscore.controller;

import com.accesscore.dto.AssignTaskRequest;
import com.accesscore.entity.TaskItem;
import com.accesscore.repository.TaskItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskAssignmentTest {

    @Mock
    private TaskItemRepository taskRepository;

    @InjectMocks
    private TaskController controller;

    @Test
    void assignsTaskToSpecifiedUser() {
        TaskItem task = new TaskItem("TSK-1010", "Audit logs", "Review logs",
                "TODO", "High", null, "Tara Anand", "Engineering");
        when(taskRepository.findByTaskCode("TSK-1010")).thenReturn(Optional.of(task));
        when(taskRepository.save(any(TaskItem.class))).thenAnswer(inv -> inv.getArgument(0));

        AssignTaskRequest req = new AssignTaskRequest();
        req.setAssignee("James Wilson");

        ResponseEntity<TaskItem> response = controller.assignTask("TSK-1010", req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getAssignee()).isEqualTo("James Wilson");
    }
}
