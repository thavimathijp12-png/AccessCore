package com.accesscore;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.HealthResponse;
import com.accesscore.dto.LoginRequest;
import com.accesscore.entity.ServiceRequest;
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
class AccessCoreApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
    }

    @Test
    void healthEndpointReturnsUp() {
        String url = "http://localhost:" + port + "/api/health";
        ResponseEntity<HealthResponse> response = restTemplate.getForEntity(url, HealthResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        HealthResponse body = response.getBody();
        assertThat(body).isNotNull();
        if (body != null) {
            assertThat(body.getStatus()).isEqualTo("UP");
            assertThat(body.getApplication()).isEqualTo("ACCESSCORE Backend");
            assertThat(body.getMessage()).isEqualTo("Backend is running successfully");
        }
    }

    @Test
    void loginAndFetchRequestsLifecycle() {
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginReq = new LoginRequest("tara.anand@accesscore.io", "admin123");
        ResponseEntity<AuthResponse> authResponse = restTemplate.postForEntity(loginUrl, loginReq, AuthResponse.class);

        assertThat(authResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthResponse authBody = authResponse.getBody();
        assertThat(authBody).isNotNull();
        if (authBody != null) {
            String token = authBody.getToken();
            assertThat(token).isNotBlank();
            assertThat(authBody.getUser()).isNotNull();
            if (authBody.getUser() != null) {
                assertThat(authBody.getUser().getName()).isEqualTo("Tara Anand");
            }

            // Authenticated request to /api/requests
            String requestsUrl = "http://localhost:" + port + "/api/requests";
            HttpHeaders headers = new HttpHeaders();
            if (token != null) {
                headers.setBearerAuth(token);
            }
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<ServiceRequest[]> requestsResponse = restTemplate.exchange(
                    requestsUrl, HttpMethod.GET, entity, ServiceRequest[].class);

            assertThat(requestsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            ServiceRequest[] requestsBody = requestsResponse.getBody();
            assertThat(requestsBody).isNotNull();
            if (requestsBody != null) {
                assertThat(requestsBody.length).isGreaterThanOrEqualTo(3);
            }
        }
    }

    @Test
    void teamLeadLoginAndPermissions() {
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginReq = new LoginRequest("sarah.chen@accesscore.io", "lead123");
        ResponseEntity<AuthResponse> authResponse = restTemplate.postForEntity(loginUrl, loginReq, AuthResponse.class);

        assertThat(authResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthResponse authBody = authResponse.getBody();
        assertThat(authBody).isNotNull();
        if (authBody != null) {
            String token = authBody.getToken();
            assertThat(token).isNotBlank();
            assertThat(authBody.getUser()).isNotNull();
            if (authBody.getUser() != null) {
                assertThat(authBody.getUser().getName()).isEqualTo("Sarah Chen");
                assertThat(authBody.getUser().getRole()).isEqualTo("Team Lead");
            }
        }
    }

    @Test
    void employeeCannotAccessAdminOnlyUserManagementEndpoint() {
        // 1. Employee Login
        String loginUrl = "http://localhost:" + port + "/api/auth/login";
        LoginRequest loginReq = new LoginRequest("james.wilson@accesscore.io", "emp123");
        ResponseEntity<AuthResponse> authResponse = restTemplate.postForEntity(loginUrl, loginReq, AuthResponse.class);

        assertThat(authResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthResponse authBody = authResponse.getBody();
        assertThat(authBody).isNotNull();
        if (authBody != null) {
            String empToken = authBody.getToken();
            assertThat(empToken).isNotBlank();

            // 2. Employee attempts to access Admin-only /api/users
            String adminUsersUrl = "http://localhost:" + port + "/api/users";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(empToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    adminUsersUrl, HttpMethod.GET, entity, String.class);

            // Expect HTTP 403 Forbidden
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        }
    }

    @Test
    void unauthenticatedAccessIsBlocked() {
        String adminUsersUrl = "http://localhost:" + port + "/api/users";
        ResponseEntity<String> response = restTemplate.getForEntity(adminUsersUrl, String.class);
        assertThat(response.getStatusCode()).isIn(HttpStatus.FORBIDDEN, HttpStatus.UNAUTHORIZED);
    }
}
