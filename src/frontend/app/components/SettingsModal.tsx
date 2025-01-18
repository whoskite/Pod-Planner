'use client';

import React, { useState } from 'react';
import styles from './SettingsModal.module.css';
import type { BotStatus, ScheduledGM } from '../../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: BotStatus | null;
  onUpdateTimezone: (timezone: string) => Promise<void>;
  defaultTimezone: string;
  scheduledGMs: ScheduledGM[];
}

export default function SettingsModal({ isOpen, onClose, status, onUpdateTimezone, defaultTimezone, scheduledGMs }: SettingsModalProps) {
  const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleTimezoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
    setIsSaving(true);
    try {
      await onUpdateTimezone(newTimezone);
    } catch (error) {
      console.error('Failed to update timezone:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Bot Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Bot Status</h3>
            <p className={styles.statusText}>{status?.status || 'Loading...'}</p>
          </div>

          <div className={styles.section}>
            <h3>Configuration</h3>
            <div className={styles.configItem}>
              <label>Publish Time:</label>
              <span>{status?.publishTime || 'Loading...'}</span>
            </div>
            <div className={styles.configItem}>
              <label>Default Timezone:</label>
              <select
                value={selectedTimezone}
                onChange={handleTimezoneChange}
                className={styles.select}
                disabled={isSaving}
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Next Scheduled GM</h3>
            <p>{status?.nextScheduledTime || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 