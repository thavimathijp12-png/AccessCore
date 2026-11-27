package com.accesscore.service;

import com.accesscore.entity.Approval;
import com.accesscore.repository.ApprovalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ApprovalService {

    private final ApprovalRepository approvalRepository;

    public ApprovalService(ApprovalRepository approvalRepository) {
        this.approvalRepository = approvalRepository;
    }

    @Transactional(readOnly = true)
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }

    @Transactional
    public Optional<Approval> makeDecision(String code, Map<String, String> payload) {
        return approvalRepository.findByApprovalCode(code).map(app -> {
            String decision = payload.get("decision");
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
            return approvalRepository.save(app);
        });
    }
}
