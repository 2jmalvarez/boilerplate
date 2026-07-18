type LogFields = Record<string, boolean | number | string | null | undefined>;

function write(level: 'info' | 'error', event: string, fields: LogFields = {}): void {
  const safeFields = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      /authorization|cookie|password|secret|token|database_?url/i.test(key) ? '[REDACTED]' : value,
    ] as const),
  );
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeFields,
  };

  const output = JSON.stringify(entry);
  if (level === 'error') process.stderr.write(`${output}\n`);
  else process.stdout.write(`${output}\n`);
}

// Request bodies and headers are never accepted; sensitive-looking field names are redacted defensively.
export const logger = {
  info: (event: string, fields?: LogFields) => write('info', event, fields),
  error: (event: string, fields?: LogFields) => write('error', event, fields),
};
