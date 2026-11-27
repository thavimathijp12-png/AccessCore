package com.accesscore.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @Test
    void generatesAndValidatesTokenWithExpectedSubject() {
        JwtTokenProvider provider = new JwtTokenProvider(TEST_SECRET, 60_000L);

        String token = provider.generateToken("tara.anand@accesscore.io", "ADMIN", "USR-001", "Tara Anand");

        assertThat(token).isNotBlank();
        assertThat(provider.validateToken(token)).isTrue();
        assertThat(provider.getEmailFromToken(token)).isEqualTo("tara.anand@accesscore.io");
    }

    @Test
    void rejectsMalformedOrTamperedTokens() {
        JwtTokenProvider provider = new JwtTokenProvider(TEST_SECRET, 60_000L);
        String token = provider.generateToken("tara.anand@accesscore.io", "ADMIN", "USR-001", "Tara Anand");

        assertThat(provider.validateToken("not.a.jwt")).isFalse();
        assertThat(provider.validateToken(token + "tampered")).isFalse();
        assertThat(provider.validateToken("")).isFalse();
    }

    @Test
    void rejectsExpiredToken() {
        JwtTokenProvider provider = new JwtTokenProvider(TEST_SECRET, -1_000L);
        String expiredToken = provider.generateToken("tara.anand@accesscore.io", "ADMIN", "USR-001", "Tara Anand");

        assertThat(provider.validateToken(expiredToken)).isFalse();
    }
}
