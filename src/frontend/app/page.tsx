'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import type { BotStatus, ScheduledGM } from '../../types';
import ScheduleGM from './components/ScheduleGM';
import SettingsModal from './components/SettingsModal';
import SwipeableGM from './components/SwipeableGM';
import Notification from './components/Notification';
import SettingsIcon from './components/icons/SettingsIcon';
import QueueIcon from './components/icons/QueueIcon';
import ScheduleIcon from './components/icons/ScheduleIcon';
import BottomNav from './components/BottomNav';
import ScheduleModal from './components/ScheduleModal';

interface NotificationState {
  message: string;
  type: 'error' | 'success';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TIMEZONE_KEY = 'gm-bot-timezone';

export default function Home() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [scheduledGMs, setScheduledGMs] = useState<ScheduledGM[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [selectedGM, setSelectedGM] = useState<ScheduledGM | null>(null);
  const [defaultTimezone, setDefaultTimezone] = useState(
    typeof window !== 'undefined' 
      ? localStorage.getItem(TIMEZONE_KEY) || Intl.DateTimeFormat().resolvedOptions().timeZone
      : Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const updateDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchScheduledGMs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scheduled-gms`);
      const data = await response.json();
      setScheduledGMs(data);
    } catch (error) {
      console.error('Error fetching scheduled GMs:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Sending delete request for GM:', id);
      const response = await fetch(`${API_URL}/api/scheduled-gms/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid server response');
      }
      
      if (response.ok) {
        setScheduledGMs(prev => prev.filter(gm => gm.id !== id));
        setNotification({
          message: data.message || 'GM deleted successfully',
          type: 'success'
        });
      } else {
        throw new Error(data.error || 'Failed to delete GM');
      }
    } catch (error) {
      console.error('Error deleting GM:', error);
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to delete GM',
        type: 'error'
      });
    }
  };

  const handleSchedule = async (success: boolean, message: string) => {
    if (success) {
      await fetchScheduledGMs();
      setNotification({
        message: 'GM scheduled successfully!',
        type: 'success'
      });
    } else {
      setNotification({
        message: message || 'Failed to schedule GM',
        type: 'error'
      });
    }
  };

  const handleUpdateTimezone = async (timezone: string) => {
    try {
      // Save to localStorage
      localStorage.setItem(TIMEZONE_KEY, timezone);
      setDefaultTimezone(timezone);
      
      setNotification({
        message: 'Default timezone updated successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to update timezone:', error);
      setNotification({
        message: 'Failed to update timezone',
        type: 'error'
      });
    }
  };

  const handleEdit = (gm: ScheduledGM) => {
    setSelectedGM(gm);
    setIsScheduleOpen(true);
  };

  useEffect(() => {
    updateDashboard();
    const interval = setInterval(updateDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchScheduledGMs();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <img 
              src="/images/The Pod Logo.png" 
              alt="Pod Planner Logo" 
              className={styles.logo}
            />
            <h1 className={styles.title}>Pod Planner</h1>
          </div>
          <button 
            className={styles.settingsButton}
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon />
            Settings
          </button>
        </header>

        <section className={styles.queueSection}>
          <div className={styles.sectionHeader}>
            <QueueIcon className={styles.sectionIcon} />
            <h2>Pending Messages</h2>
          </div>
          <div className={styles.gmQueue}>
            {scheduledGMs.filter(gm => gm.status === 'pending').length === 0 ? (
              <div className={styles.emptyState}>
                No pending messages. Schedule a new one below!
              </div>
            ) : (
              scheduledGMs
                .filter(gm => gm.status === 'pending')
                .map((gm) => (
                  <SwipeableGM 
                    key={gm.id} 
                    gm={gm} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
            )}
          </div>
        </section>

        <section className={`${styles.scheduleSection} ${styles.desktopOnly}`}>
          <div className={styles.sectionHeader}>
            <ScheduleIcon className={styles.sectionIcon} />
            <h2>Schedule Message</h2>
          </div>
          <ScheduleGM 
            onSchedule={handleSchedule} 
            defaultTimezone={defaultTimezone}
          />
        </section>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={status}
        onUpdateTimezone={handleUpdateTimezone}
        defaultTimezone={defaultTimezone}
        scheduledGMs={scheduledGMs}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setSelectedGM(null);
        }}
        onSchedule={handleSchedule}
        defaultTimezone={defaultTimezone}
        editGM={selectedGM}
      />

      <BottomNav onOpenSchedule={() => setIsScheduleOpen(true)} />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
} 