package com.accesscore.controller;

import com.accesscore.dto.AssignRequest;
import com.accesscore.entity.ServiceRequest;
import com.accesscore.repository.ServiceRequestRepository;
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
class RequestAssignmentTest {

    @Mock
    private ServiceRequestRepository requestRepository;

    @InjectMocks
    private ServiceRequestController controller;

    @Test
    void assignsRequestAndPromotesNewStatusToAssigned() {
        ServiceRequest req = new ServiceRequest("REQ-0010", "VPN Setup", "Access",
                "High", "New", "Engineering", "Need VPN", null, "James Wilson");
        when(requestRepository.findByRequestCode("REQ-0010")).thenReturn(Optional.of(req));
        when(requestRepository.save(any(ServiceRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        AssignRequest assign = new AssignRequest();
        assign.setAssignedTo("Mike Torres");

        ResponseEntity<ServiceRequest> response = controller.assignRequest("REQ-0010", assign);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getAssignedTo()).isEqualTo("Mike Torres");
        assertThat(response.getBody().getStatus()).isEqualTo("Assigned");
    }
}
