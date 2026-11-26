package com.accesscore.service;

import org.springframework.stereotype.Service;

/**
 * Base service marker for ACCESSCORE business logic layer.
 */
@Service
public class HealthService {

    public String getStatus() {
        return "UP";
    }
}
