'use client';

import { useState, useEffect } from 'react';
import ResultSummary from './ResultSummary';

interface Question {
  id: string;
  type: string;
  question_text: string;
  context?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizGameProps {
  category: string;
  count: number;
  difficulty: string;
  onExit: () => void;
}

export default function QuizGame({ category, count, difficulty, onExit }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, count, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      // Handle both { questions: [...] } and direct array response if API varies
      const qs = data.questions || (Array.isArray(data) ? data : []);
      
      if (qs.length === 0) {
        throw new Error('No questions generated. Please try again.');
      }

      setQuestions(qs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      saveHistory();
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsFinished(false);
  };

  const saveHistory = () => {
    const historyItem = {
      date: new Date().toISOString(),
      category,
      score: questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correct_answer ? 1 : 0), 0),
      total: questions.length
    };
    
    const saved = localStorage.getItem('quiz_history');
    const history = saved ? JSON.parse(saved) : [];
    localStorage.setItem('quiz_history', JSON.stringify([historyItem, ...history]));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Generating Quiz...</div>
        <p style={{ color: 'var(--secondary)' }}>Using AI to create unique questions for {category}.</p>
        <div className="loader" style={{ marginTop: '2rem' }}></div> 
        {/* Add simple CSS loader in globals if needed, or just text for now */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <h3 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error</h3>
        <p style={{ marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={onExit}>Back to Dashboard</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <ResultSummary 
        questions={questions} 
        userAnswers={userAnswers} 
        onRetry={handleRetry} 
        onNewQuiz={onExit} 
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onExit} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          Exit
        </button>
        <div style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div style={{ height: '6px', backgroundColor: 'var(--card-border)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{currentQuestion.question_text}</h2>
        
        {currentQuestion.context && (
          <div style={{ 
            backgroundColor: 'var(--background)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius)',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            {currentQuestion.context}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: '1rem',
                textAlign: 'left',
                borderRadius: 'var(--radius)',
                border: `2px solid ${userAnswers[currentIndex] === opt ? 'var(--primary)' : 'var(--card-border)'}`,
                backgroundColor: userAnswers[currentIndex] === opt ? 'rgba(79, 70, 229, 0.05)' : 'var(--card-bg)',
                color: userAnswers[currentIndex] === opt ? 'var(--primary)' : 'var(--foreground)',
                fontWeight: userAnswers[currentIndex] === opt ? '600' : 'normal',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            disabled={!userAnswers[currentIndex]}
            style={{ opacity: !userAnswers[currentIndex] ? 0.5 : 1, cursor: !userAnswers[currentIndex] ? 'not-allowed' : 'pointer' }}
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
