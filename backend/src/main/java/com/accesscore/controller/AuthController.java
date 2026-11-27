package com.accesscore.controller;

import com.accesscore.dto.AuthResponse;
import com.accesscore.dto.ChangePasswordRequest;
import com.accesscore.dto.LoginRequest;
import com.accesscore.dto.SwitchRoleRequest;
import com.accesscore.dto.UserDto;
import com.accesscore.entity.User;
import com.accesscore.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/switch-role")
    public ResponseEntity<AuthResponse> switchRole(
            @Valid @RequestBody SwitchRoleRequest request,
            @AuthenticationPrincipal User currentUser) {
        AuthResponse response = authService.switchRoleWithPassword(request.getRole(), request.getPassword(), currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        authService.changePassword(currentUser, request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }
}
