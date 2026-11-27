package com.accesscore.controller;

import com.accesscore.dto.CreateUserRequest;
import com.accesscore.dto.StatusUpdateRequest;
import com.accesscore.dto.UpdateUserRequest;
import com.accesscore.dto.UserDto;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest payload) {
        String name = payload.getName().trim();
        String email = payload.getEmail().toLowerCase().trim();
        String rawPassword = (payload.getPassword() != null && !payload.getPassword().isBlank())
                ? payload.getPassword()
                : "emp123";
        String roleStr = (payload.getRole() != null && !payload.getRole().isBlank()) ? payload.getRole() : "EMPLOYEE";
        String department = (payload.getDepartment() != null && !payload.getDepartment().isBlank())
                ? payload.getDepartment().trim()
                : "Engineering";
        String title = (payload.getTitle() != null && !payload.getTitle().isBlank())
                ? payload.getTitle().trim()
                : "Associate Engineer";

        long count = userRepository.count() + 1;
        String userCode = (payload.getUserCode() != null && !payload.getUserCode().isBlank())
                ? payload.getUserCode().trim()
                : String.format("USR-%03d", count);

        Role role = Role.fromString(roleStr);
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User(userCode, name, email, encodedPassword, role, department, title);
        user.setStatus((payload.getStatus() != null && !payload.getStatus().isBlank()) ? payload.getStatus() : "Active");
        user.setPhone(payload.getPhone() != null ? payload.getPhone() : "+1 (555) 000-0000");
        user.setLocation(payload.getLocation() != null ? payload.getLocation() : "San Francisco, CA");
        user.setBio(payload.getBio() != null ? payload.getBio() : "");

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @PatchMapping("/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable String code, @Valid @RequestBody UpdateUserRequest payload) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (payload.getName() != null && !payload.getName().isBlank()) user.setName(payload.getName().trim());
        if (payload.getEmail() != null && !payload.getEmail().isBlank()) user.setEmail(payload.getEmail().toLowerCase().trim());
        if (payload.getDepartment() != null) user.setDepartment(payload.getDepartment());
        if (payload.getTitle() != null) user.setTitle(payload.getTitle());
        if (payload.getPhone() != null) user.setPhone(payload.getPhone());
        if (payload.getLocation() != null) user.setLocation(payload.getLocation());
        if (payload.getBio() != null) user.setBio(payload.getBio());
        if (payload.getRole() != null && !payload.getRole().isBlank()) user.setRole(Role.fromString(payload.getRole()));
        if (payload.getStatus() != null && !payload.getStatus().isBlank()) user.setStatus(payload.getStatus());
        if (payload.getPassword() != null && !payload.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(payload.getPassword()));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserDto.fromEntity(saved));
    }

    @PatchMapping("/{code}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserStatus(@PathVariable String code, @Valid @RequestBody StatusUpdateRequest payload) {
        User user = userRepository.findByUserCode(code).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setStatus(payload.getStatus().trim());
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
