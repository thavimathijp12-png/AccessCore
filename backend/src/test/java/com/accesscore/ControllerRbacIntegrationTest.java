package com.accesscore;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ControllerRbacIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void authMeReturns401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void employeeCanReadTeamAndBugsButCannotCreateTasksOrApprove() throws Exception {
        mockMvc.perform(get("/api/team"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))));

        mockMvc.perform(get("/api/bugs"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Unauthorized Task\",\"priority\":\"High\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/approvals/APR-3001/decision")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"decision\":\"APPROVED\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "TEAM_LEAD")
    void teamLeadCanCreateTaskAndMakeApprovalDecisionButCannotDeleteTask() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Lead Sprint Review\",\"priority\":\"High\",\"department\":\"Operations\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Lead Sprint Review"));

        mockMvc.perform(post("/api/approvals/APR-3001/decision")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"decision\":\"APPROVED\",\"approver\":\"Sarah Chen\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        mockMvc.perform(delete("/api/tasks/TSK-1001"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCrudAndNotFoundHandlingAcrossEndpoints() throws Exception {
        mockMvc.perform(get("/api/bugs/BUG-9999"))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/notifications/NOT-999/read"))
                .andExpect(status().isNotFound());

        mockMvc.perform(post("/api/bugs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"API Timeout\",\"severity\":\"High\",\"environment\":\"Staging\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("API Timeout"));

        mockMvc.perform(get("/api/users/USR-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("tara.anand@accesscore.io"));
    }
}
