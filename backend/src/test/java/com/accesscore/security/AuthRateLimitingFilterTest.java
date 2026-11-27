package com.accesscore.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class AuthRateLimitingFilterTest {

    @Test
    void allowsRequestsWithinLimitAndBlocksExcess() throws Exception {
        AuthRateLimitingFilter filter = new AuthRateLimitingFilter();

        for (int i = 0; i < 30; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
            req.setRemoteAddr("10.0.0.1");
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(req, res, new MockFilterChain());
            assertThat(res.getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest blockedReq = new MockHttpServletRequest("POST", "/api/auth/login");
        blockedReq.setRemoteAddr("10.0.0.1");
        MockHttpServletResponse blockedRes = new MockHttpServletResponse();
        filter.doFilter(blockedReq, blockedRes, new MockFilterChain());
        assertThat(blockedRes.getStatus()).isEqualTo(429);
    }

    @Test
    void skipsNonAuthEndpoints() throws Exception {
        AuthRateLimitingFilter filter = new AuthRateLimitingFilter();
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/requests");
        assertThat(filter.shouldNotFilter(req)).isTrue();
    }
}
