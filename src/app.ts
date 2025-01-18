import express, { Request, Response } from 'express';
import cors from 'cors';
import { scheduleGm, scheduleCustomGm, postGm } from './utils';
import { PUBLISH_CAST_TIME, TIME_ZONE } from './config';
import { v4 as uuidv4 } from 'uuid';
import { getScheduledGMs, setScheduledGMs, scheduledJobs } from "./store";
import { ScheduledGM } from "./types/index";

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://your-frontend-url.com';

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

// Apply CORS first, before any routes
app.use(cors(corsOptions));

// Then apply other middleware
app.use(express.json());

// Add this before other routes for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes start here...
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'GM Bot API is running' });
});

// API Routes
app.get('/api/status', (req: Request, res: Response) => {
  const now = new Date();
  const [hours, minutes] = (PUBLISH_CAST_TIME || '09:00').split(':').map(Number);
  
  // Calculate next scheduled time
  const nextSchedule = new Date();
  nextSchedule.setHours(hours);
  nextSchedule.setMinutes(minutes);
  nextSchedule.setSeconds(0);
  
  if (nextSchedule <= now) {
    nextSchedule.setDate(nextSchedule.getDate() + 1);
  }

  res.json({
    status: 'running',
    publishTime: PUBLISH_CAST_TIME || '09:00',
    timezone: TIME_ZONE || 'UTC',
    nextScheduledTime: nextSchedule.toLocaleString('en-US', {
      timeZone: TIME_ZONE || 'UTC'
    })
  });
});

app.get('/api/scheduled-gms', (req: Request, res: Response) => {
  res.json(getScheduledGMs());
});

app.post('/api/scheduled-gms', async (req: Request, res: Response) => {
  try {
    const { message, scheduleTime, timezone } = req.body;
    console.log('Received schedule request:', { message, scheduleTime, timezone });
    
    if (!message || !scheduleTime || !timezone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { message, scheduleTime, timezone }
      });
    }

    const scheduleDate = new Date(scheduleTime);
    const now = new Date();
    const isImmediate = scheduleDate.getTime() <= now.getTime();

    // Generate a single ID to use for both the GM and its job
    const gmId = uuidv4();

    if (isImmediate) {
      await postGm(message);
      const newGM: ScheduledGM = {
        id: gmId,
        message,
        scheduleTime: now.toISOString(),
        timezone,
        status: 'completed'
      };
      const currentGMs = getScheduledGMs();
      setScheduledGMs([...currentGMs, newGM]);
      return res.status(201).json(newGM);
    }

    // Create the GM object first
    const newGM: ScheduledGM = {
      id: gmId,
      message,
      scheduleTime,
      timezone,
      status: 'pending'
    };

    // Try to create the job with the same ID
    const job = scheduleCustomGm(newGM);

    if (!job) {
      throw new Error('Failed to create scheduled job');
    }

    // Only save to list if job creation was successful
    const currentGMs = getScheduledGMs();
    setScheduledGMs([...currentGMs, newGM]);
    
    res.status(201).json(newGM);
  } catch (error) {
    console.error('Error scheduling GM:', error);
    res.status(500).json({ 
      error: 'Failed to schedule GM',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/scheduled-gms/delete', async (req: Request, res: Response) => {
  console.log('Delete request received:', req.body);
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing GM ID' });
    }

    // Get the GM before deleting to check if it exists
    const currentGMs = getScheduledGMs();
    const gmToDelete = currentGMs.find(gm => gm.id === id);
    
    if (!gmToDelete) {
      return res.status(404).json({ error: 'GM not found' });
    }

    // Stop and remove the cron job if it exists
    const job = scheduledJobs.get(id);
    if (job) {
      console.log('Stopping cron job for ID:', id);
      job.stop();
      scheduledJobs.delete(id);
    }

    // Remove from the list regardless of status
    setScheduledGMs(currentGMs.filter(gm => gm.id !== id));
    
    console.log('GM deleted successfully:', gmToDelete);
    console.log('Current scheduled jobs:', Array.from(scheduledJobs.keys()));
    
    res.json({ 
      success: true, 
      message: 'GM deleted successfully',
      deletedGM: gmToDelete 
    });
  } catch (error) {
    console.error('Error deleting scheduled GM:', error);
    res.status(500).json({ 
      error: 'Failed to delete scheduled GM',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add a catch-all route handler for debugging
app.use((req: Request, res: Response) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not Found' });
});

// Schedule the GM cron job
scheduleGm();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
