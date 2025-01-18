export interface BotStatus {
  status: string;
  publishTime: string;
  timezone: string;
  nextScheduledTime: string;
}

export interface ScheduledGM {
  id: string;
  message: string;
  scheduleTime: string; // ISO string
  timezone: string;
  status: 'pending' | 'completed' | 'failed';
} 