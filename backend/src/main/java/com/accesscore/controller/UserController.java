package com.accesscore.controller;

import com.accesscore.dto.UserDto;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserByCode(@PathVariable String code) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@NonNull @RequestBody Map<String, String> payload) {
        String name = payload.getOrDefault("name", "New Employee");
        String email = payload.getOrDefault("email", "employee@accesscore.io").toLowerCase().trim();
        String rawPassword = payload.getOrDefault("password", "emp123");
        String roleStr = payload.getOrDefault("role", "EMPLOYEE");
        String department = payload.getOrDefault("department", "Engineering");
        String title = payload.getOrDefault("title", "Associate Engineer");

        long count = userRepository.count() + 1;
        String userCode = payload.getOrDefault("userCode", String.format("USR-%03d", count));

        Role role = Role.fromString(roleStr);
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User(userCode, name, email, encodedPassword, role, department, title);
        user.setStatus(payload.getOrDefault("status", "Active"));
        user.setPhone(payload.getOrDefault("phone", "+1 (555) 000-0000"));
        user.setLocation(payload.getOrDefault("location", "San Francisco, CA"));
        user.setBio(payload.getOrDefault("bio", ""));

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @PatchMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (payload.containsKey("name")) user.setName(payload.get("name"));
        if (payload.containsKey("email")) user.setEmail(payload.get("email").toLowerCase().trim());
        if (payload.containsKey("department")) user.setDepartment(payload.get("department"));
        if (payload.containsKey("title")) user.setTitle(payload.get("title"));
        if (payload.containsKey("phone")) user.setPhone(payload.get("phone"));
        if (payload.containsKey("location")) user.setLocation(payload.get("location"));
        if (payload.containsKey("bio")) user.setBio(payload.get("bio"));
        if (payload.containsKey("role")) user.setRole(Role.fromString(payload.get("role")));
        if (payload.containsKey("status")) user.setStatus(payload.get("status"));
        if (payload.containsKey("password") && !payload.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(payload.get("password")));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @PatchMapping("/{code}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserStatus(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = payload.getOrDefault("status", "Inactive");
        user.setStatus(newStatus);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String code) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }
}
