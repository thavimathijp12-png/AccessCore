package com.accesscore.controller;

import com.accesscore.repository.ApprovalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApprovalStatsTest {

    @Mock
    private ApprovalRepository approvalRepository;

    @InjectMocks
    private ApprovalController controller;

    @Test
    void returnsPendingApprovedAndRejectedCounts() {
        when(approvalRepository.countByStatusIgnoreCase("PENDING")).thenReturn(2L);
        when(approvalRepository.countByStatusIgnoreCase("APPROVED")).thenReturn(5L);
        when(approvalRepository.countByStatusIgnoreCase("REJECTED")).thenReturn(1L);

        ResponseEntity<Map<String, Long>> response = controller.getApprovalStats();

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("pending")).isEqualTo(2L);
        assertThat(response.getBody().get("approved")).isEqualTo(5L);
        assertThat(response.getBody().get("rejected")).isEqualTo(1L);
    }
}
