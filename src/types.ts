export interface Draft {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotStatus {
  status: string;
  publishTime: string;
  nextScheduledTime: string;
}

export interface ScheduledGM {
  id: string;
  message: string;
  scheduleTime: string;
  timezone: string;
  status: 'pending' | 'completed' | 'failed';
} 