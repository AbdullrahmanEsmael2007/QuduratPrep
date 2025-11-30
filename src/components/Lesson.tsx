'use client';

import { useState, useEffect } from 'react';
import MiniPractice from './MiniPractice';

interface LessonProps {
  category: string;
  onBack: () => void;
}

interface LessonData {
  explanation: string;
  common_tricks: string[];
  examples: any[];
  practice: any[];
}

export default function Lesson({ category, onBack }: LessonProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLesson();
  }, [category]);

  const fetchLesson = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load lesson');
      }

      setLessonData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Lesson...</div>
        <p style={{ color: 'var(--secondary)' }}>Preparing educational content for {category}.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <h3 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error</h3>
        <p style={{ marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={onBack}>Back to Teach Mode</button>
      </div>
    );
  }

  if (!lessonData) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button 
        className="btn btn-secondary" 
        onClick={onBack}
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back to Teach Mode
      </button>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          {category}
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Understanding the Concept</h2>
          <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {lessonData.explanation}
          </p>
        </div>

        {lessonData.common_tricks && lessonData.common_tricks.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Common Exam Tricks</h2>
            <ul style={{ lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              {lessonData.common_tricks.map((trick, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{trick}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Detailed Examples</h2>
          {lessonData.examples.map((example, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: 'var(--background)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius)',
                marginBottom: '1.5rem',
                border: '1px solid var(--card-border)'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                Example {index + 1}
              </div>
              {example.base_pair && (
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  <strong>Base Pair:</strong> {example.base_pair}
                </p>
              )}
              {example.sentence && (
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  "{example.sentence}"
                </p>
              )}
              {example.paragraph && (
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  {example.paragraph}
                </p>
              )}
              <p style={{ marginBottom: '1rem' }}>{example.question || 'Choose the correct answer:'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                {example.options.map((opt: string) => (
                  <div 
                    key={opt} 
                    style={{ 
                      padding: '0.75rem', 
                      border: `2px solid ${opt === example.correct_answer ? 'var(--success)' : 'var(--card-border)'}`,
                      borderRadius: 'var(--radius)',
                      backgroundColor: opt === example.correct_answer ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      fontWeight: opt === example.correct_answer ? 'bold' : 'normal',
                      color: opt === example.correct_answer ? 'var(--success)' : 'inherit'
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              <div style={{ 
                backgroundColor: 'var(--card-bg)', 
                padding: '1rem', 
                borderRadius: 'var(--radius)',
                borderLeft: '4px solid var(--success)'
              }}>
                <strong>Explanation:</strong> {example.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Practice Questions</h2>
        <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
          Test your understanding with these interactive practice questions. Get instant feedback!
        </p>
        <MiniPractice questions={lessonData.practice} category={category} />
      </div>
    </div>
  );
}
