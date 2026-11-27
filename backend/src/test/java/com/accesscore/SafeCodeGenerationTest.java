package com.accesscore;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.LoginRequest;
import com.accesscore.entity.ServiceRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class SafeCodeGenerationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String adminToken;

    @BeforeEach
    void authenticateAdmin() {
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/auth/login",
                new LoginRequest("tara.anand@accesscore.io", "admin123"),
                AuthResponse.class
        );
        assertThat(response.getBody()).isNotNull();
        adminToken = response.getBody().getToken();
    }

    @Test
    void deletingRecordDoesNotCauseCodeCollisionOnNextCreate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Delete REQ-0001 (seeded 1..3)
        restTemplate.exchange(
                "http://localhost:" + port + "/api/requests/REQ-0001",
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                Void.class
        );

        // Creating a new request without code should generate REQ-0004 (not REQ-0003)
        ServiceRequest newReq = new ServiceRequest(null, "Collision Safe Request", "Software",
                "Medium", "New", "Engineering", "Verify sequence generation", "James Wilson", "Tara Anand");

        ResponseEntity<ServiceRequest> created = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/requests",
                new HttpEntity<>(newReq, headers),
                ServiceRequest.class
        );

        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(created.getBody()).isNotNull();
        assertThat(created.getBody().getRequestCode()).isEqualTo("REQ-0004");
    }

    @Test
    void duplicateUniqueIdentifierReturns409Conflict() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ServiceRequest duplicate = new ServiceRequest("REQ-0002", "Duplicate Code", "Hardware",
                "Low", "New", "Engineering", "Duplicate code test", "James Wilson", "Tara Anand");

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/requests",
                new HttpEntity<>(duplicate, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Conflict");
    }
}
