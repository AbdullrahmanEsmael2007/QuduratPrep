'use client';

import { useState } from 'react';

interface MiniPracticeProps {
  questions: any[];
  category: string;
}

export default function MiniPractice({ questions, category }: MiniPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Reset to beginning
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (!currentQuestion) {
    return <p style={{ color: 'var(--secondary)' }}>No practice questions available.</p>;
  }

  const isCorrect = selectedAnswer === currentQuestion.correct_answer;

  return (
    <div>
      <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
        Practice Question {currentIndex + 1} of {questions.length}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {currentQuestion.base_pair && (
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <strong>Base Pair:</strong> {currentQuestion.base_pair}
          </p>
        )}
        {currentQuestion.sentence && (
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            "{currentQuestion.sentence}"
          </p>
        )}
        {currentQuestion.paragraph && (
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {currentQuestion.paragraph}
          </p>
        )}
        <p style={{ fontSize: '1.1rem' }}>
          {currentQuestion.question || 'Choose the correct answer:'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {currentQuestion.options.map((opt: string) => {
          let style: any = {
            padding: '1rem',
            textAlign: 'left',
            borderRadius: 'var(--radius)',
            border: '2px solid var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            cursor: showFeedback ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          };

          if (showFeedback) {
            if (opt === currentQuestion.correct_answer) {
              style.borderColor = 'var(--success)';
              style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
              style.color = 'var(--success)';
              style.fontWeight = 'bold';
            } else if (opt === selectedAnswer) {
              style.borderColor = 'var(--error)';
              style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              style.color = 'var(--error)';
            }
          } else if (selectedAnswer === opt) {
            style.borderColor = 'var(--primary)';
            style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
          }

          return (
            <button
              key={opt}
              onClick={() => !showFeedback && handleSelect(opt)}
              style={style}
              disabled={showFeedback}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div style={{ 
          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: isCorrect ? 'var(--success)' : 'var(--error)'
          }}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Correct Answer:</strong> {currentQuestion.correct_answer}
          </p>
          <p>
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </p>
        </div>
      )}

      {showFeedback && (
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          style={{ width: '100%' }}
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Start Over'}
        </button>
      )}
    </div>
  );
}
