package com.accesscore;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StatusTransitionValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void invalidRequestStatusReturnsBadRequest() throws Exception {
        mockMvc.perform(patch("/api/requests/REQ-0001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"INVALID_STATE\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid service request status: 'INVALID_STATE'"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void validTaskStatusUpdateSucceeds() throws Exception {
        mockMvc.perform(patch("/api/tasks/TSK-1001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"REVIEW\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVIEW"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void invalidApprovalDecisionReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/approvals/APR-3001/decision")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"decision\":\"HOLD\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid approval decision: 'HOLD'. Allowed values: APPROVED, REJECTED"));
    }
}
