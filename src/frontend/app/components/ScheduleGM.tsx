'use client';

import React, { useState, useEffect } from 'react';
import styles from './ScheduleGM.module.css';
import { ScheduledGM } from '../../../types';

interface ScheduleGMProps {
  onSchedule: (success: boolean, responseMessage: string) => void;
  defaultTimezone: string;
  editGM?: ScheduledGM | null;
  initialMessage?: string;
}

export default function ScheduleGM({ onSchedule, defaultTimezone, editGM, initialMessage }: ScheduleGMProps) {
  const [message, setMessage] = useState(editGM?.message || initialMessage || '');
  const [scheduleTime, setScheduleTime] = useState(() => {
    if (editGM) {
      const date = new Date(editGM.scheduleTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  });
  const [error, setError] = useState<string | null>(null);
  const [minDateTime, setMinDateTime] = useState('');

  // Update minimum date time whenever component mounts or timezone changes
  useEffect(() => {
    const now = new Date();
    // Add 30 seconds buffer to current time
    now.setSeconds(now.getSeconds() + 30);
    
    // Convert to user's timezone and format for datetime-local input
    const userNow = new Date(now.toLocaleString('en-US', { timeZone: defaultTimezone }));
    const year = userNow.getFullYear();
    const month = String(userNow.getMonth() + 1).padStart(2, '0');
    const day = String(userNow.getDate()).padStart(2, '0');
    const hours = String(userNow.getHours()).padStart(2, '0');
    const minutes = String(userNow.getMinutes()).padStart(2, '0');
    
    const minDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    setMinDateTime(minDate);
  }, [defaultTimezone]);

  // Update form when editGM changes
  useEffect(() => {
    if (editGM) {
      setMessage(editGM.message);
      const date = new Date(editGM.scheduleTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setScheduleTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [editGM]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!message) {
        setError('Please enter a message');
        onSchedule(false, 'Please enter a message');
        return;
      }

      // Get current time in user's timezone
      const now = new Date();
      const userNow = new Date(now.toLocaleString('en-US', { timeZone: defaultTimezone }));
      userNow.setSeconds(userNow.getSeconds() + 30); // Add 30 second buffer

      // Parse the selected time (which is already in user's timezone)
      const scheduledDate = new Date(scheduleTime);

      if (scheduledDate <= userNow && !editGM) {
        setError('Please select a future time');
        onSchedule(false, 'Please select a future time');
        return;
      }

      // Convert to UTC for API by adjusting for timezone offset
      const utcScheduleTime = new Date(scheduleTime);

      const endpoint = editGM 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/scheduled-gms/${editGM.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/scheduled-gms`;

      const response = await fetch(endpoint, {
        method: editGM ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          scheduleTime: utcScheduleTime.toISOString(),
          timezone: defaultTimezone,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to schedule message');
      }

      // Format the scheduled time for the success message
      const formattedTime = scheduledDate.toLocaleString('en-US', {
        timeZone: defaultTimezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      setMessage('');
      setScheduleTime('');
      onSchedule(true, `Message ${editGM ? 'updated' : 'scheduled'} for ${formattedTime}`);
    } catch (error) {
      console.error('Failed to schedule message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to schedule message';
      setError(errorMessage);
      onSchedule(false, errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.inputGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="scheduleTime">Schedule Time:</label>
          <input
            type="datetime-local"
            id="scheduleTime"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            min={editGM ? undefined : minDateTime}
            required
          />
          <small className={styles.helperText}>
            {editGM ? 'Update the schedule time' : 'Select a time in the future'}
          </small>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        {editGM ? 'Update' : 'Schedule'}
      </button>
    </form>
  );
} 