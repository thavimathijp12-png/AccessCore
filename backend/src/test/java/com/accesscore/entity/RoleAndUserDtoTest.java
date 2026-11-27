package com.accesscore.entity;

import com.accesscore.dto.UserDto;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RoleAndUserDtoTest {

    @Test
    void roleFromStringHandlesDisplayNamesAndKeys() {
        assertThat(Role.fromString("admin")).isEqualTo(Role.ADMIN);
        assertThat(Role.fromString("Team Lead")).isEqualTo(Role.TEAM_LEAD);
        assertThat(Role.fromString("TEAM_LEAD")).isEqualTo(Role.TEAM_LEAD);
        assertThat(Role.fromString("employee")).isEqualTo(Role.EMPLOYEE);
    }

    @Test
    void userDtoMapsFieldsWithoutExposingPassword() {
        User user = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                "secret-hash", Role.ADMIN, "Engineering", "Senior Architect");
        user.setStatus("Active");

        UserDto dto = UserDto.fromEntity(user);

        assertThat(dto.getId()).isEqualTo("USR-001");
        assertThat(dto.getName()).isEqualTo("Tara Anand");
        assertThat(dto.getEmail()).isEqualTo("tara.anand@accesscore.io");
        assertThat(dto.getDepartment()).isEqualTo("Engineering");
    }
}
