package com.accesscore.controller;

import com.accesscore.dto.HealthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class HealthControllerTest {

    @Test
    void checkHealthReturnsUpPayload() {
        HealthController controller = new HealthController();
        ResponseEntity<HealthResponse> response = controller.checkHealth();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("UP");
        assertThat(response.getBody().getApplication()).isEqualTo("ACCESSCORE Backend");
    }
}
