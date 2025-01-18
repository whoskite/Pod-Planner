'use client';

import React from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  // Format the message if it's a success message for scheduling
  const formattedMessage = React.useMemo(() => {
    if (type === 'success' && message.startsWith('Message scheduled for')) {
      const [_, dateTime] = message.split('Message scheduled for ');
      return (
        <>
          <strong>Message Scheduled! 🎉</strong>
          <br />
          {dateTime}
        </>
      );
    }
    return message;
  }, [message, type]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <p>{formattedMessage}</p>
      <button onClick={onClose} className={styles.closeButton}>×</button>
    </div>
  );
} 