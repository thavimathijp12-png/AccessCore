package com.accesscore.controller;

import com.accesscore.entity.Approval;
import com.accesscore.repository.ApprovalRepository;
import com.accesscore.util.WorkflowStatusValidator;
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

    @PostMapping("/{code}/decision")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    public ResponseEntity<Approval> makeDecision(@PathVariable String code, @NonNull @RequestBody Map<String, String> payload) {
        String decision = WorkflowStatusValidator.validateApprovalDecision(payload.get("decision"));
        return approvalRepository.findByApprovalCode(code).<ResponseEntity<Approval>>map((@NonNull Approval app) -> {
            String approver = payload.getOrDefault("approver", "Tara Anand");
            String reason = payload.get("reason");

            app.setStatus(decision);
            if ("REJECTED".equals(decision)) {
                app.setRejectionReason(reason);
            }
            app.setApprover(approver);
            app.setDecisionDate(LocalDateTime.now());
            Approval saved = approvalRepository.save(app);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
