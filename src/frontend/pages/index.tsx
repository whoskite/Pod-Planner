import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import React from 'react';

interface BotStatus {
  status: string;
  publishTime: string;
  timezone: string;
  nextScheduledTime: string;
}

export default function Home() {
  const [status, setStatus] = useState<BotStatus | null>(null);

  const updateDashboard = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    updateDashboard();
    const interval = setInterval(updateDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <h1>GM Bot Dashboard</h1>
        <div className={`${styles.status} ${styles.active}`}>
          <h2>Bot Status: <span>{status?.status || 'Loading...'}</span></h2>
        </div>
        <div className={`${styles.status} ${styles.scheduled}`}>
          <h2>Next Scheduled GM:</h2>
          <p>{status?.nextScheduledTime || 'Loading...'}</p>
        </div>
        <div>
          <h2>Configuration:</h2>
          <p>Publish Time: <span>{status?.publishTime || 'Loading...'}</span></p>
          <p>Timezone: <span>{status?.timezone || 'Loading...'}</span></p>
        </div>
      </div>
    </div>
  );
} 