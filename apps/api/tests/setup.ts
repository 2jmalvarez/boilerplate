import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.PORT ??= '3001';
process.env.DATABASE_URL ??= process.env.TEST_DATABASE_URL ?? 'postgresql://test:test@localhost:5432/unused';
process.env.JWT_SECRET ??= 'test-secret-that-is-at-least-32-characters-long';
process.env.JWT_ISSUER ??= 'boilerplate-api-test';
process.env.JWT_AUDIENCE ??= 'boilerplate-test-clients';
process.env.CORS_ORIGIN ??= 'http://localhost:3000';
