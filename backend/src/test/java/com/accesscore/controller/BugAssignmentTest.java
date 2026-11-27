package com.accesscore.controller;

import com.accesscore.dto.AssignBugRequest;
import com.accesscore.entity.BugReport;
import com.accesscore.repository.BugReportRepository;
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
class BugAssignmentTest {

    @Mock
    private BugReportRepository bugRepository;

    @InjectMocks
    private BugReportController controller;

    @Test
    void assignsBugAndPromotesOpenStatusToAssigned() {
        BugReport bug = new BugReport("BUG-2010", "Null token", "High", "OPEN",
                "Production", null, "Elena Rostova");
        when(bugRepository.findByBugCode("BUG-2010")).thenReturn(Optional.of(bug));
        when(bugRepository.save(any(BugReport.class))).thenAnswer(inv -> inv.getArgument(0));

        AssignBugRequest req = new AssignBugRequest();
        req.setAssignedTo("Mike Torres");

        ResponseEntity<BugReport> response = controller.assignBug("BUG-2010", req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getAssignedTo()).isEqualTo("Mike Torres");
        assertThat(response.getBody().getStatus()).isEqualTo("ASSIGNED");
    }
}
