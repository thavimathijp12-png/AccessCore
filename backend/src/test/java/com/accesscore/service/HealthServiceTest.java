package com.accesscore.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HealthServiceTest {

    @Test
    void returnsUpStatus() {
        HealthService service = new HealthService();
        assertThat(service.getStatus()).isEqualTo("UP");
    }
}
