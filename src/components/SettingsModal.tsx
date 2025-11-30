'use client';

import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (difficulty: string) => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [difficulty, setDifficulty] = useState('College');

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('quiz_difficulty') || 'College';
    setDifficulty(savedDifficulty);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('quiz_difficulty', difficulty);
    onSave(difficulty);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Settings</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Academic Level
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['High School', 'College', 'Academic'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                {level}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
            Controls the academic level of generated questions.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
