'use client';

import React, { useState, useEffect } from 'react';
import styles from './ComposeMessage.module.css';
import { Draft } from '../../../types';

interface ComposeMessageProps {
  onSubmit: (message: string) => void;
  onClose: () => void;
}

const DRAFTS_KEY = 'pod-planner-drafts';

const CircleProgress = ({ value, max }: { value: number; max: number }) => {
  const percentage = (value / max) * 100;
  const isOverLimit = value > max;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg width="20" height="20" className={`${styles.circleProgress} ${isOverLimit ? styles.overLimit : ''}`}>
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        strokeWidth="2"
        className={styles.circleBackground}
      />
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        strokeWidth="2"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className={styles.circleForeground}
      />
    </svg>
  );
};

export default function ComposeMessage({ onSubmit, onClose }: ComposeMessageProps) {
  const [message, setMessage] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const maxLength = 320;
  const maxImages = 2;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem(DRAFTS_KEY);
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const saveDraft = () => {
    if (!message.trim()) return;
    
    const newDraft: Draft = {
      id: Date.now().toString(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDrafts = [newDraft, ...drafts];
    setDrafts(updatedDrafts);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
    setMessage('');
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
  };

  const loadDraft = (draft: Draft) => {
    setMessage(draft.message);
    setShowDrafts(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > maxLength;

  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.composeWrapper}>
      <div className={styles.header}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.actionButton} ${showDrafts ? styles.activeAction : ''}`}
            onClick={() => {
              if (message.trim()) saveDraft();
              setShowDrafts(!showDrafts);
            }}
          >
            Drafts ({drafts.length})
          </button>
          <button 
            className={styles.scheduleButton}
            onClick={() => message.trim() && onSubmit(message)}
            disabled={!message.trim() || isOverLimit}
          >
            Schedule
          </button>
        </div>
      </div>

      {showDrafts ? (
        <div className={styles.draftsList}>
          {drafts.length === 0 ? (
            <div className={styles.emptyDrafts}>
              No saved drafts
            </div>
          ) : (
            drafts.map(draft => (
              <div key={draft.id} className={styles.draftItem}>
                <div className={styles.draftContent} onClick={() => loadDraft(draft)}>
                  <p className={styles.draftMessage}>{draft.message}</p>
                  <p className={styles.draftTime}>
                    {new Date(draft.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button 
                  className={styles.deleteDraftButton}
                  onClick={() => deleteDraft(draft.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.composeForm}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img src="/images/The Pod Logo.png" alt="User Avatar" />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <textarea
              value={message}
              onChange={handleTextAreaInput}
              placeholder="What's happening?"
              className={styles.messageInput}
              rows={4}
            />

            {images.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {images.map((image, index) => (
                  <div key={index} className={styles.imagePreviewContainer}>
                    <img src={image} alt={`Upload ${index + 1}`} className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className={`${styles.toolbarButton} ${images.length >= maxImages ? styles.disabled : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path 
                    fill="currentColor" 
                    d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.characterCount}>
              {characterCount > 0 && (
                <CircleProgress value={characterCount} max={maxLength} />
              )}
              <div className={`${styles.countBubble} ${isOverLimit ? styles.overLimit : ''}`}>
                {maxLength - characterCount}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 