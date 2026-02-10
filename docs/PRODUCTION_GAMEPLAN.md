Production Readiness Game Plan

### Phase 1: Code Quality & Security (do first)

1. Fix TypeScript strict mode errors — the Fastify request.user typing issue across all routes; small but should
   be clean before production
2. Rate limiting — add @fastify/rate-limit to prevent brute-force attacks on login and purchase endpoints
3. Input sanitization — ensure all user inputs are sanitized beyond Zod validation
4. HTTPS enforcement — both frontend and backend must serve over HTTPS in production
5. Environment variable validation — fail fast on startup if required env vars are missing

### Phase 2: Plaid Production Migration

6. Apply for Plaid Production access — requires a Plaid application review process (can take weeks)
7. Switch from sandbox to development/production Plaid environment
8. Implement Plaid webhooks — currently you poll for transactions; production should use webhooks for real-time
   updates
9. Handle Plaid item errors gracefully — token expiration, re-authentication flows

### Phase 3: Infrastructure & Deployment

10. Deploy backend — AWS (ECS/Fargate, Lambda, or EC2) or a platform like Railway/Render
11. Deploy frontend — Vercel (natural fit for Next.js) or AWS Amplify
12. Set up CI/CD — GitHub Actions to run builds/tests on push, auto-deploy on merge to main
13. Separate environments — dev, staging, production with different database instances and Plaid keys
14. Secrets management — move from .env files to AWS Secrets Manager or Parameter Store

### Phase 4: Reliability

15. Add error monitoring — Sentry or similar for both frontend and backend
16. Add logging — structured logging (Pino is built into Fastify) + ship to CloudWatch or similar
17. Database backups — verify Aurora automated backups are enabled and test restore
18. Health check monitoring — uptime monitoring on /health endpoint (UptimeRobot, AWS CloudWatch)

### Phase 5: Testing

19. Unit tests — service layer validation logic, crypto utils
20. Integration tests — API endpoint tests against a test database
21. E2E tests — Playwright or Cypress for critical flows (register, login, connect bank, purchase note)

### Phase 6: Business Logic Completion

22. Real ACH integration — replace simulated purchases with actual Plaid Transfer or a payment processor
23. Note maturity handling — cron job or scheduled task to process matured notes
24. Email notifications — purchase confirmations, maturity alerts (AWS SES or SendGrid)
25. User profile/settings page — update email, password, view KYC info
26. Admin dashboard — manage notes, view all purchases, user management
