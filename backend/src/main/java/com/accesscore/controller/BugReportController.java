package com.accesscore.controller;

import com.accesscore.entity.BugReport;
import com.accesscore.repository.BugReportRepository;
import com.accesscore.util.EntityCodeGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bugs")
public class BugReportController {

    private final BugReportRepository bugRepository;
    private final EntityCodeGenerator codeGenerator;

    public BugReportController(BugReportRepository bugRepository, EntityCodeGenerator codeGenerator) {
        this.bugRepository = bugRepository;
        this.codeGenerator = codeGenerator;
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
            List<String> existingCodes = bugRepository.findAll().stream()
                    .map(BugReport::getBugCode)
                    .collect(Collectors.toList());
            bug.setBugCode(codeGenerator.nextCode("BUG", 4, 2001, existingCodes, bugRepository::existsByBugCode));
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
}
