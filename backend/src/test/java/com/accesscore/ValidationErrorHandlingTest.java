package com.accesscore;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.LoginRequest;
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
class ValidationErrorHandlingTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String adminToken;

    @BeforeEach
    void authenticateAdmin() {
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                loginUrl,
                new LoginRequest("tara.anand@accesscore.io", "admin123"),
                AuthResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        adminToken = response.getBody().getToken();
    }

    @Test
    @SuppressWarnings("unchecked")
    void createServiceRequestWithBlankFieldsReturnsStructuredValidationErrors() {
        HttpHeaders headers = authHeaders();
        Map<String, Object> invalidPayload = Map.of(
                "title", "",
                "category", "",
                "priority", "High",
                "department", "IT",
                "description", "Need laptop",
                "createdBy", "Tara Anand"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                url("/api/requests"),
                new HttpEntity<>(invalidPayload, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Validation Failed");
        Map<String, Object> fieldErrors = (Map<String, Object>) response.getBody().get("fieldErrors");
        assertThat(fieldErrors).containsKeys("title", "category");
    }

    @Test
    @SuppressWarnings("unchecked")
    void createUserWithInvalidEmailReturnsValidationError() {
        HttpHeaders headers = authHeaders();
        Map<String, Object> invalidUser = Map.of(
                "name", "Test User",
                "email", "not-an-email"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                url("/api/users"),
                new HttpEntity<>(invalidUser, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        Map<String, Object> fieldErrors = (Map<String, Object>) response.getBody().get("fieldErrors");
        assertThat(fieldErrors).containsKey("email");
    }

    @Test
    @SuppressWarnings("unchecked")
    void approvalDecisionWithInvalidValueReturnsValidationError() {
        HttpHeaders headers = authHeaders();
        Map<String, Object> invalidDecision = Map.of("decision", "MAYBE");

        ResponseEntity<Map> response = restTemplate.postForEntity(
                url("/api/approvals/APR-3001/decision"),
                new HttpEntity<>(invalidDecision, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        Map<String, Object> fieldErrors = (Map<String, Object>) response.getBody().get("fieldErrors");
        assertThat(fieldErrors).containsKey("decision");
    }

    @Test
    void malformedJsonReturnsBadRequest() {
        HttpHeaders headers = authHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                url("/api/bugs"),
                new HttpEntity<>("{invalid-json", headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("Malformed or unreadable JSON request body");
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }
}
