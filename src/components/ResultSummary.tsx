'use client';

import { useState } from 'react';

interface Question {
  id: string;
  type: string;
  question_text: string;
  context?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface ResultSummaryProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export default function ResultSummary({ questions, userAnswers, onRetry, onNewQuiz }: ResultSummaryProps) {
  const [showExplanations, setShowExplanations] = useState(false);

  const score = questions.reduce((acc, q, index) => {
    return acc + (userAnswers[index] === q.correct_answer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Complete!</h2>
        <div style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: percentage >= 70 ? 'var(--success)' : 'var(--primary)',
          marginBottom: '1rem'
        }}>
          {percentage}%
        </div>
        <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '2rem' }}>
          You got {score} out of {questions.length} correct.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowExplanations(!showExplanations)}>
            {showExplanations ? 'Hide Explanations' : 'Review Answers'}
          </button>
          <button className="btn btn-primary" onClick={onRetry}>Retry Quiz</button>
          <button className="btn btn-secondary" onClick={onNewQuiz}>New Quiz</button>
        </div>
      </div>

      {showExplanations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.correct_answer;

            return (
              <div key={q.id} className="card" style={{ 
                borderLeft: `5px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` 
              }}>
                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                  Question {index + 1}
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{q.question_text}</p>
                {q.context && (
                  <div style={{ 
                    backgroundColor: 'var(--background)', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius)',
                    marginBottom: '1rem',
                    fontStyle: 'italic'
                  }}>
                    {q.context}
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map((opt) => {
                    let style = {};
                    if (opt === q.correct_answer) {
                      style = { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success)', color: 'var(--success)', fontWeight: 'bold' };
                    } else if (opt === userAnswer && !isCorrect) {
                      style = { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error)', color: 'var(--error)' };
                    }
                    
                    return (
                      <div key={opt} style={{ 
                        padding: '0.75rem', 
                        border: '1px solid var(--card-border)', 
                        borderRadius: 'var(--radius)',
                        ...style
                      }}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
