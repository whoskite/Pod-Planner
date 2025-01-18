'use client';

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './SwipeableGM.module.css';
import pageStyles from '../page.module.css';
import { ScheduledGM } from '../../../types';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';

interface SwipeableGMProps {
  gm: ScheduledGM;
  onDelete: (id: string) => Promise<void>;
  onEdit: (gm: ScheduledGM) => void;
}

export default function SwipeableGM({ gm, onDelete, onEdit }: SwipeableGMProps) {
  const [offset, setOffset] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onDelete(gm.id);
    } catch (error) {
      setIsDeleting(false);
      setOffset(0);
      setError(error instanceof Error ? error.message : 'Failed to delete GM');
    }
  };

  const handleEdit = () => {
    onEdit(gm);
  };

  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (event.dir === 'Left') {
        const newOffset = Math.min(0, Math.max(-200, -event.deltaX));
        setOffset(newOffset);
      }
    },
    onSwipedLeft: async (event) => {
      if (event.deltaX >= 150) {
        await handleDelete();
      } else {
        setOffset(0);
      }
    },
    onSwipedRight: () => {
      setOffset(0);
    },
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div 
      className={`${styles.container} ${isDeleting ? styles.deleting : ''}`}
      {...handlers}
    >
      <div 
        className={styles.content}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <div className={`${pageStyles.gmItem} ${pageStyles[gm.status]}`}>
          <div className={styles.gmHeader}>
            <p className={pageStyles.message}>{gm.message}</p>
            <div className={styles.actionButtons}>
              <button 
                className={styles.editButton}
                onClick={handleEdit}
                title="Edit GM"
              >
                <EditIcon />
              </button>
              <button 
                className={styles.trashButton}
                onClick={handleDelete}
                title="Delete GM"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          <p className={pageStyles.time}>
            {new Date(gm.scheduleTime).toLocaleString(undefined, {
              timeZone: gm.timezone
            })}
          </p>
          <span className={pageStyles.status}>{gm.status}</span>
        </div>
      </div>
      <div 
        className={styles.deleteAction}
        onClick={handleDelete}
      >
        <TrashIcon />
        <span className={styles.deleteText}>Delete</span>
      </div>
    </div>
  );
} 