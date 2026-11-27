package com.accesscore.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ResponseDtoTest {

    @Test
    void healthResponseStoresAllFields() {
        HealthResponse res = new HealthResponse("UP", "ACCESSCORE Backend", "OK");
        assertThat(res.getStatus()).isEqualTo("UP");
        assertThat(res.getApplication()).isEqualTo("ACCESSCORE Backend");
        assertThat(res.getMessage()).isEqualTo("OK");
    }

    @Test
    void authResponseStoresTokenAndUser() {
        UserDto user = new UserDto();
        user.setEmail("tara.anand@accesscore.io");
        AuthResponse res = new AuthResponse("tok-123", user);
        assertThat(res.getToken()).isEqualTo("tok-123");
        assertThat(res.getUser().getEmail()).isEqualTo("tara.anand@accesscore.io");
    }
}
