package com.accesscore.service;

import com.accesscore.dto.UserDto;
import com.accesscore.entity.Role;
import com.accesscore.entity.User;
import com.accesscore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UserDto> getUserByCode(String code) {
        return userRepository.findByUserCode(code).map(UserDto::fromEntity);
    }

    @Transactional
    public UserDto createUser(Map<String, String> payload) {
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

        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public Optional<UserDto> updateUser(String code, Map<String, String> payload) {
        return userRepository.findByUserCode(code).map(user -> {
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
            return UserDto.fromEntity(userRepository.save(user));
        });
    }

    @Transactional
    public Optional<UserDto> updateUserStatus(String code, String newStatus) {
        return userRepository.findByUserCode(code).map(user -> {
            user.setStatus(newStatus);
            return UserDto.fromEntity(userRepository.save(user));
        });
    }

    @Transactional
    public boolean deleteUser(String code) {
        Optional<User> existing = userRepository.findByUserCode(code);
        if (existing.isEmpty()) {
            return false;
        }
        userRepository.delete(existing.get());
        return true;
    }
}
