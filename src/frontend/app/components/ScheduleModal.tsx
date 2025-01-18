'use client';

import React, { useState } from 'react';
import styles from './ScheduleModal.module.css';
import ComposeMessage from './ComposeMessage';
import { ScheduledGM } from '../../../types';
import ScheduleGM from './ScheduleGM';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (success: boolean, message: string) => void;
  defaultTimezone: string;
  editGM?: ScheduledGM | null;
}

export default function ScheduleModal({ isOpen, onClose, onSchedule, defaultTimezone, editGM }: ScheduleModalProps) {
  const [message, setMessage] = useState(editGM?.message || '');
  const [showSchedule, setShowSchedule] = useState(false);

  if (!isOpen) return null;

  const handleMessageSubmit = (newMessage: string) => {
    setMessage(newMessage);
    setShowSchedule(true);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {!showSchedule ? (
          <ComposeMessage 
            onSubmit={handleMessageSubmit}
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.header}>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button 
                className={styles.gmButton}
                onClick={() => {
                  // This will be handled by the ScheduleGM form submit
                }}
              >
                GM
              </button>
            </div>
            <div className={styles.content}>
              <ScheduleGM 
                onSchedule={(success, responseMessage) => {
                  onSchedule(success, responseMessage);
                  if (success) {
                    onClose();
                    setShowSchedule(false);
                    setMessage('');
                  }
                }}
                defaultTimezone={defaultTimezone}
                editGM={editGM}
                initialMessage={message}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 