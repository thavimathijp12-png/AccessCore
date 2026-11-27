package com.accesscore.controller;

import com.accesscore.entity.Approval;
import com.accesscore.repository.ApprovalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalRepository approvalRepository;

    public ApprovalController(ApprovalRepository approvalRepository) {
        this.approvalRepository = approvalRepository;
    }

    @GetMapping
    public ResponseEntity<List<Approval>> getAllApprovals() {
        return ResponseEntity.ok(approvalRepository.findAll());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<Map<String, Long>> getApprovalStats() {
        return ResponseEntity.ok(Map.of(
                "pending", approvalRepository.countByStatusIgnoreCase("PENDING"),
                "approved", approvalRepository.countByStatusIgnoreCase("APPROVED"),
                "rejected", approvalRepository.countByStatusIgnoreCase("REJECTED")
        ));
    }

    @PostMapping("/{code}/decision")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<Approval> makeDecision(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        return approvalRepository.findByApprovalCode(code).<ResponseEntity<Approval>>map((@NonNull Approval app) -> {
            String decision = payload.get("decision"); // "APPROVED" or "REJECTED"
            String approver = payload.getOrDefault("approver", "Tara Anand");
            String reason = payload.get("reason");

            if ("APPROVED".equalsIgnoreCase(decision)) {
                app.setStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(decision)) {
                app.setStatus("REJECTED");
                app.setRejectionReason(reason);
            }
            app.setApprover(approver);
            app.setDecisionDate(LocalDateTime.now());
            Approval saved = approvalRepository.save(app);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
