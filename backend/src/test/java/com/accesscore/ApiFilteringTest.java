package com.accesscore;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.LoginRequest;
import com.accesscore.entity.Approval;
import com.accesscore.entity.ServiceRequest;
import com.accesscore.entity.TaskItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiFilteringTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpEntity<Void> authEntity;

    @BeforeEach
    void authenticate() {
        ResponseEntity<AuthResponse> auth = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/auth/login",
                new LoginRequest("tara.anand@accesscore.io", "admin123"),
                AuthResponse.class
        );
        assertThat(auth.getBody()).isNotNull();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(auth.getBody().getToken());
        authEntity = new HttpEntity<>(headers);
    }

    @Test
    void filterRequestsByPriorityAndDepartment() {
        ResponseEntity<ServiceRequest[]> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/requests?priority=Critical&department=Engineering",
                HttpMethod.GET, authEntity, ServiceRequest[].class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().length).isEqualTo(1);
        assertThat(response.getBody()[0].getRequestCode()).isEqualTo("REQ-0003");
    }

    @Test
    void filterTasksByAssignee() {
        ResponseEntity<TaskItem[]> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/tasks?assignee=James Wilson",
                HttpMethod.GET, authEntity, TaskItem[].class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().length).isGreaterThanOrEqualTo(1);
        assertThat(response.getBody()).allMatch(t -> "James Wilson".equalsIgnoreCase(t.getAssignee()));
    }

    @Test
    void filterApprovalsByStatus() {
        ResponseEntity<Approval[]> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/approvals?status=PENDING",
                HttpMethod.GET, authEntity, Approval[].class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).allMatch(a -> "PENDING".equalsIgnoreCase(a.getStatus()));
    }
}
