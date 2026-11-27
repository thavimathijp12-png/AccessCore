package com.accesscore.controller;

import com.accesscore.dto.CreateBugReportDto;
import com.accesscore.dto.StatusUpdateRequest;
import com.accesscore.entity.BugReport;
import com.accesscore.repository.BugReportRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<BugReport> createBug(@Valid @RequestBody CreateBugReportDto dto) {
        String bugCode = dto.getBugCode();
        if (bugCode == null || bugCode.isBlank()) {
            long count = bugRepository.count() + 2001;
            bugCode = String.format("BUG-%04d", count);
        }
        String status = (dto.getStatus() == null || dto.getStatus().isBlank()) ? "OPEN" : dto.getStatus();

        BugReport bug = new BugReport(
                bugCode,
                dto.getTitle().trim(),
                dto.getSeverity().trim(),
                status,
                dto.getEnvironment().trim(),
                dto.getAssignedTo(),
                dto.getReportedBy()
        );
        bug.setReproductionSteps(dto.getReproductionSteps());
        bug.setExpectedResult(dto.getExpectedResult());
        bug.setActualResult(dto.getActualResult());

        BugReport saved = bugRepository.save(bug);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{code}/status")
    public ResponseEntity<BugReport> updateBugStatus(@PathVariable String code,
            @Valid @RequestBody StatusUpdateRequest payload) {
        BugReport bug = bugRepository.findByBugCode(code).orElse(null);
        if (bug == null) {
            return ResponseEntity.notFound().build();
        }
        bug.setStatus(payload.getStatus().trim());
        BugReport saved = bugRepository.save(bug);
        return ResponseEntity.ok(saved);
    }
}
