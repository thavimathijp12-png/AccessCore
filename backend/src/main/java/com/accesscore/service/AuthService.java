package com.accesscore.service;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.LoginRequest;
import com.accesscore.dto.UserDto;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import com.accesscore.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String rawPassword = request.getPassword();
        Optional<User> userOpt = userRepository.findByEmail(email);

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!"Active".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Account is not active. Please contact an administrator.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getUserCode(), user.getName());
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    public AuthResponse switchRoleWithPassword(String roleKey, String password, User currentUser) {
        if (roleKey == null || roleKey.isBlank()) {
            throw new IllegalArgumentException("Target role is required.");
        }

        String normalizedKey = roleKey.toLowerCase().replace("_", "").replace(" ", "").trim();
        Role targetRole = switch (normalizedKey) {
            case "teamlead", "lead" -> Role.TEAM_LEAD;
            case "employee", "emp" -> Role.EMPLOYEE;
            case "admin", "administrator" -> Role.ADMIN;
            default -> throw new IllegalArgumentException("Unsupported target role: " + roleKey);
        };

        User targetUser = userRepository.findByRole(targetRole).stream().findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No user found for role: " + targetRole));

        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password verification is required to switch roles.");
        }

        String trimmedPassword = password.trim();
        boolean matches = passwordEncoder.matches(trimmedPassword, targetUser.getPassword());

        if (!matches && currentUser != null) {
            matches = passwordEncoder.matches(trimmedPassword, currentUser.getPassword());
        }

        if (!matches) {
            throw new IllegalArgumentException("Incorrect password for role switch. Access denied.");
        }

        String token = tokenProvider.generateToken(targetUser.getEmail(), targetRole.name(), targetUser.getUserCode(), targetUser.getName());
        return new AuthResponse(token, UserDto.fromEntity(targetUser));
    }
}
