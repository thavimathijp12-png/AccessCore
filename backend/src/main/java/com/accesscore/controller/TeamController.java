package com.accesscore.controller;

import com.accesscore.dto.UserDto;
import com.accesscore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final UserService userService;

    public TeamController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getTeamMembers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
