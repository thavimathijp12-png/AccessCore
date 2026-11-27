package com.accesscore.service;

import com.accesscore.dto.ChangePasswordRequest;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import com.accesscore.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChangePasswordTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void updatesEncodedPasswordWhenCurrentPasswordMatches() {
        User user = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                "encoded-old", Role.ADMIN, "Engineering", "Admin");
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("oldpass");
        req.setNewPassword("newpass123");

        when(passwordEncoder.matches("oldpass", "encoded-old")).thenReturn(true);
        when(passwordEncoder.encode("newpass123")).thenReturn("encoded-new");

        authService.changePassword(user, req);

        assertThat(user.getPassword()).isEqualTo("encoded-new");
        verify(userRepository).save(user);
    }

    @Test
    void throwsWhenCurrentPasswordIsIncorrect() {
        User user = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                "encoded-old", Role.ADMIN, "Engineering", "Admin");
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("wrong");
        req.setNewPassword("newpass123");

        when(passwordEncoder.matches("wrong", "encoded-old")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(user, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("incorrect");
    }
}
