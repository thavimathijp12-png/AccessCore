package com.accesscore.controller;

import com.accesscore.dto.ApprovalDecisionRequest;
import com.accesscore.entity.Approval;
import com.accesscore.repository.ApprovalRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
    public ResponseEntity<Approval> makeDecision(@PathVariable String code, @Valid @RequestBody ApprovalDecisionRequest payload) {
        return approvalRepository.findByApprovalCode(code).<ResponseEntity<Approval>>map((@NonNull Approval app) -> {
            String decision = payload.getDecision().trim();
            String approver = (payload.getApprover() != null && !payload.getApprover().isBlank())
                    ? payload.getApprover().trim()
                    : "Tara Anand";

            if ("APPROVED".equalsIgnoreCase(decision)) {
                app.setStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(decision)) {
                app.setStatus("REJECTED");
                app.setRejectionReason(payload.getReason());
            }
            app.setApprover(approver);
            app.setDecisionDate(LocalDateTime.now());
            Approval saved = approvalRepository.save(app);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
