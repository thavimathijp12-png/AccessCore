package com.accesscore.controller;

import com.accesscore.dto.AssignBugRequest;
import com.accesscore.entity.BugReport;
import com.accesscore.repository.BugReportRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bugs")
public class BugReportController {

    private final BugReportRepository bugRepository;

    public BugReportController(BugReportRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    @GetMapping
    public ResponseEntity<List<BugReport>> getAllBugs() {
        return ResponseEntity.ok(bugRepository.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<BugReport> getBugByCode(@PathVariable String code) {
        return bugRepository.findByBugCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BugReport> createBug(@NonNull @RequestBody BugReport bug) {
        if (bug.getBugCode() == null || bug.getBugCode().isEmpty()) {
            long count = bugRepository.count() + 2001;
            bug.setBugCode(String.format("BUG-%04d", count));
        }
        if (bug.getStatus() == null) {
            bug.setStatus("OPEN");
        }
        BugReport saved = bugRepository.save(bug);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<BugReport> updateBugStatus(@PathVariable String code,
            @NonNull @RequestBody Map<String, String> payload) {
        BugReport bug = bugRepository.findByBugCode(code).orElse(null);
        if (bug == null) {
            return ResponseEntity.notFound().build();
        }
        String newStatus = payload.get("status");
        if (newStatus != null) {
            bug.setStatus(newStatus);
        }
        BugReport saved = bugRepository.save(bug);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<BugReport> assignBug(
            @PathVariable String code,
            @Valid @RequestBody AssignBugRequest payload) {
        BugReport bug = bugRepository.findByBugCode(code).orElse(null);
        if (bug == null) {
            return ResponseEntity.notFound().build();
        }
        bug.setAssignedTo(payload.getAssignedTo().trim());
        if ("OPEN".equalsIgnoreCase(bug.getStatus())) {
            bug.setStatus("ASSIGNED");
        }
        return ResponseEntity.ok(bugRepository.save(bug));
    }
}
