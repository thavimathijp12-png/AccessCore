package com.accesscore.service;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.LoginRequest;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginReturnsTokenForValidCredentials() {
        User user = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                "hashed", Role.ADMIN, "Engineering", "Admin");
        when(userRepository.findByEmail("tara.anand@accesscore.io")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("admin123", "hashed")).thenReturn(true);
        when(tokenProvider.generateToken("tara.anand@accesscore.io", "ADMIN", "USR-001", "Tara Anand"))
                .thenReturn("jwt-token");

        AuthResponse response = authService.login(new LoginRequest("tara.anand@accesscore.io", "admin123"));

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUser().getEmail()).isEqualTo("tara.anand@accesscore.io");
    }

    @Test
    void loginThrowsOnWrongPassword() {
        User user = new User("USR-001", "Tara Anand", "tara.anand@accesscore.io",
                "hashed", Role.ADMIN, "Engineering", "Admin");
        when(userRepository.findByEmail("tara.anand@accesscore.io")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("badpass", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("tara.anand@accesscore.io", "badpass")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
