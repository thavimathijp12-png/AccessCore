package com.accesscore.controller;

import com.accesscore.entity.Approval;
import com.accesscore.service.ApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    public ResponseEntity<List<Approval>> getAllApprovals() {
        return ResponseEntity.ok(approvalService.getAllApprovals());
    }

    @PostMapping("/{code}/decision")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<Approval> makeDecision(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        return approvalService.makeDecision(code, payload)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
