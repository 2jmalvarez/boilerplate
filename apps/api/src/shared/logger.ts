type LogFields = Record<string, unknown>;
type HttpLogLevel = "basic" | "detailed";

const sensitiveKeyPattern = /authorization|cookie|password|secret|token|database_?url/i;
const ansi = {
  reset: "\u001B[0m",
  dim: "\u001B[2m",
  blue: "\u001B[34m",
  cyan: "\u001B[36m",
  green: "\u001B[32m",
  magenta: "\u001B[35m",
  red: "\u001B[31m",
  yellow: "\u001B[33m",
};

function sanitize(value: unknown, key?: string): unknown {
  if (key && sensitiveKeyPattern.test(key)) return "[REDACTED]";
  if (Array.isArray(value)) return value.map((item) => sanitize(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        sanitize(childValue, childKey),
      ]),
    );
  }
  return value;
}

function color(value: string, code: string, enabled: boolean): string {
  return enabled ? `${code}${value}${ansi.reset}` : value;
}

function statusColor(status: number): string {
  if (status >= 500) return ansi.red;
  if (status >= 400) return ansi.yellow;
  if (status >= 300) return ansi.cyan;
  return ansi.green;
}

function write(
  level: "info" | "error",
  event: string,
  fields: LogFields = {},
): void {
  const safeFields = sanitize(fields) as LogFields;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeFields,
  };

  const output = JSON.stringify(entry);
  if (level === "error") process.stderr.write(`${output}\n`);
  else process.stdout.write(`${output}\n`);
}

function writeRequest(fields: LogFields, level: HttpLogLevel, colors: boolean): void {
  const safeFields = sanitize(fields) as LogFields;
  const { body, method, params, query, requestError, status, durationMs, url } =
    safeFields;
  const errorDetails =
    requestError && typeof requestError === "object"
      ? (requestError as LogFields)
      : undefined;
  const timestamp = color(new Date().toISOString(), ansi.dim, colors);
  const requestMethod = color(String(method), ansi.magenta, colors);
  const requestStatus = color(String(status), statusColor(Number(status)), colors);
  const requestUrl = color(String(url), ansi.blue, colors);
  const requestDuration = color(`${String(durationMs)}ms`, ansi.dim, colors);
  const errorCode =
    typeof errorDetails?.code === "string" ? ` ${errorDetails.code}` : "";

  let output = `${timestamp} ${requestMethod} ${requestUrl} -> ${requestStatus}${color(errorCode, ansi.red, colors)} ${requestDuration}`;
  const details: [string, unknown][] = [];
  if (errorDetails?.message) details.push(["error", errorDetails.message]);
  if (errorDetails?.cause) details.push(["cause", errorDetails.cause]);
  if (level === "detailed") {
    details.push(
      ...Object.entries({ params, query, body }).filter(
        ([, value]) =>
          value !== undefined &&
          (typeof value !== "object" || value === null || Object.keys(value).length > 0),
      ),
    );
  }
  if (details.length > 0) {
    output += `\n${details
      .map(([key, value]) => {
        const formattedValue =
          typeof value === "string" ? value : JSON.stringify(value);
        return `  ${color(`${key}:`, ansi.cyan, colors)} ${formattedValue}`;
      })
      .join("\n")}`;
  }
  const stream = Number(status) >= 500 ? process.stderr : process.stdout;
  stream.write(`${output}\n`);
}

export const logger = {
  info: (event: string, fields?: LogFields) => write("info", event, fields),
  error: (event: string, fields?: LogFields) => write("error", event, fields),
  request: (fields: LogFields, level: HttpLogLevel, colors: boolean) =>
    writeRequest(fields, level, colors),
};
