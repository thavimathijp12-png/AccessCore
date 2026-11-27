# Security Policy

## Reporting a Vulnerability
If you discover a security vulnerability in AccessCore, please report it privately to the repository maintainers rather than opening a public issue.

## Production Configuration Checklist
- Override `JWT_SECRET` with a strong, randomly generated 256-bit (minimum 32-byte) secret via environment variables.
- Provide `DB_PASSWORD` via environment variables or a secret manager; never commit real credentials.
- Set `JPA_HIBERNATE_DDL_AUTO=validate` in production environments.
- Restrict CORS origins to your deployed frontend domain.
