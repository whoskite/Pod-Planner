'use client';

import React from 'react';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  onOpenSchedule: () => void;
}

export default function BottomNav({ onOpenSchedule }: BottomNavProps) {
  return (
    <div className={styles.bottomNav}>
      <button 
        className={styles.addButton}
        onClick={onOpenSchedule}
        aria-label="Schedule new GM"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
} 