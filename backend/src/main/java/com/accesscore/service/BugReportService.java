package com.accesscore.service;

import com.accesscore.entity.BugReport;
import com.accesscore.repository.BugReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BugReportService {

    private final BugReportRepository bugRepository;

    public BugReportService(BugReportRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    @Transactional(readOnly = true)
    public List<BugReport> getAllBugs() {
        return bugRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<BugReport> getByCode(String code) {
        return bugRepository.findByBugCode(code);
    }

    @Transactional
    public BugReport createBug(BugReport bug) {
        if (bug.getBugCode() == null || bug.getBugCode().isEmpty()) {
            long count = bugRepository.count() + 2001;
            bug.setBugCode(String.format("BUG-%04d", count));
        }
        if (bug.getStatus() == null) {
            bug.setStatus("OPEN");
        }
        return bugRepository.save(bug);
    }

    @Transactional
    public Optional<BugReport> updateStatus(String code, String newStatus) {
        return bugRepository.findByBugCode(code).map(bug -> {
            if (newStatus != null) {
                bug.setStatus(newStatus);
            }
            return bugRepository.save(bug);
        });
    }
}
