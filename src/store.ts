import { ScheduledGM } from "./types";
import { ScheduledTask } from "node-cron";

// Store for scheduled GMs
let scheduledGMs: ScheduledGM[] = [];

// Store for cron jobs
export const scheduledJobs = new Map<string, ScheduledTask>();

export const getScheduledGMs = () => scheduledGMs;

export const setScheduledGMs = (gms: ScheduledGM[]) => {
  scheduledGMs = gms;
};

export const updateScheduledGM = (id: string, status: 'pending' | 'completed' | 'failed') => {
  scheduledGMs = scheduledGMs.map(gm => 
    gm.id === id ? { ...gm, status } : gm
  );
};

export const storeJob = (id: string, job: ScheduledTask) => {
  scheduledJobs.set(id, job);
};

// Add cleanup function
export const cleanupJob = (id: string) => {
  const job = scheduledJobs.get(id);
  if (job) {
    job.stop();
    scheduledJobs.delete(id);
  }
}; 