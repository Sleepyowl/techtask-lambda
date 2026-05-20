function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optional(name: string, defaultValue: number): number;
function optional(name: string, defaultValue: number): string;

function optional(name: string, defaultValue: string | number) {
  const value = process.env[name];

  if (!value) {
    return defaultValue;
  }

  if (typeof defaultValue === "number") {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new Error(`Env var ${name} is not a valid number`);
    }

    return parsed;
  }

  return value;
}

export const env = {
  notificationsTable: required("NOTIFICATIONS_TABLE"),
  awsRegion: required("AWS_REGION"),
  notificationsLimit: optional("NOTIFICATIONS_LIMIT", 10000),
};
