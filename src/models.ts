export type NotificationSeverity = "info" | "warning" | "critical";

export type Notification = {
  id: string;
  severity: NotificationSeverity;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
