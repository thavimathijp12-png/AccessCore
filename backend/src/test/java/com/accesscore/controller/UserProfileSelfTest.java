package com.accesscore.controller;

import com.accesscore.dto.SelfProfileUpdateRequest;
import com.accesscore.dto.UserDto;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileSelfTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserController userController;

    @Test
    void returns401WhenUnauthenticated() {
        ResponseEntity<UserDto> response = userController.getMyProfile(null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void updatesAuthenticatedUserProfileFields() {
        User user = new User("USR-003", "James Wilson", "james.wilson@accesscore.io",
                "encoded", Role.EMPLOYEE, "Engineering", "DevOps");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        SelfProfileUpdateRequest req = new SelfProfileUpdateRequest();
        req.setPhone("+1 (555) 999-0000");
        req.setLocation("Denver, CO");
        req.setBio("Updated bio");

        ResponseEntity<UserDto> response = userController.updateMyProfile(user, req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getPhone()).isEqualTo("+1 (555) 999-0000");
        assertThat(response.getBody().getLocation()).isEqualTo("Denver, CO");
    }
}
