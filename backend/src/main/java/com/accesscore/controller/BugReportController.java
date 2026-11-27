package com.accesscore.controller;

import com.accesscore.entity.BugReport;
import com.accesscore.service.BugReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bugs")
public class BugReportController {

    private final BugReportService bugReportService;

    public BugReportController(BugReportService bugReportService) {
        this.bugReportService = bugReportService;
    }

    @GetMapping
    public ResponseEntity<List<BugReport>> getAllBugs() {
        return ResponseEntity.ok(bugReportService.getAllBugs());
    }

    @GetMapping("/{code}")
    public ResponseEntity<BugReport> getBugByCode(@PathVariable String code) {
        return bugReportService.getByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BugReport> createBug(@NonNull @RequestBody BugReport bug) {
        return ResponseEntity.ok(bugReportService.createBug(bug));
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<BugReport> updateBugStatus(@PathVariable String code,
            @NonNull @RequestBody Map<String, String> payload) {
        return bugReportService.updateStatus(code, payload.get("status"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
