package com.accesscore.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AuthDtoTest {

    @Test
    void loginRequestStoresEmailAndPassword() {
        LoginRequest req = new LoginRequest("user@accesscore.io", "pass123");
        assertThat(req.getEmail()).isEqualTo("user@accesscore.io");
        assertThat(req.getPassword()).isEqualTo("pass123");
    }

    @Test
    void switchRoleRequestStoresRoleAndPassword() {
        SwitchRoleRequest req = new SwitchRoleRequest("TEAM_LEAD", "lead123");
        assertThat(req.getRole()).isEqualTo("TEAM_LEAD");
        assertThat(req.getPassword()).isEqualTo("lead123");
    }
}
