'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';
import SettingsModal from '@/components/SettingsModal';
import QuizGame from '@/components/QuizGame';
import TeachMode from '@/components/TeachMode';

type Mode = 'quiz' | 'teach';

export default function Home() {
  const [mode, setMode] = useState<Mode>('quiz');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState('College');

  useEffect(() => {
    const savedHistory = localStorage.getItem('quiz_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    const savedDifficulty = localStorage.getItem('quiz_difficulty') || 'College';
    setDifficulty(savedDifficulty);
  }, [isQuizActive]); // Refresh history when quiz ends

  const handleStartQuiz = () => {
    setIsQuizActive(true);
  };

  const categories = [
    { id: 'Odd One Out', title: 'Odd One Out', description: 'Identify the word that is different from the others.', icon: '🧩' },
    { id: 'Analogy', title: 'Analogy', description: 'Find the pair that shares the same relationship.', icon: '🔗' },
    { id: 'Non-Logical Word', title: 'Non-Logical Word', description: 'Spot the word that makes the sentence illogical.', icon: '🚫' },
    { id: 'Paragraph Meaning', title: 'Paragraph Meaning', description: 'Choose the best summary for the paragraph.', icon: '📝' },
  ];

  if (isQuizActive && selectedCategory) {
    return (
      <QuizGame 
        category={selectedCategory} 
        count={questionCount}
        difficulty={difficulty}
        onExit={() => {
          setIsQuizActive(false);
          setSelectedCategory('');
        }} 
      />
    );
  } else if (mode === 'teach') {
    return <TeachMode />;
  } else {
    return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>QuduratPrep</h1>
          <p style={{ color: 'var(--secondary)' }}>Master your English exam preparation.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setIsSettingsOpen(true)}>
          ⚙️ Settings
        </button>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          className={`btn ${mode === ('quiz' as Mode) ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('quiz')}
          style={{ minWidth: '150px', fontSize: '1.1rem' }}
        >
          📝 Quiz Mode
        </button>
        <button 
          className={`btn ${mode === ('teach' as Mode) ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('teach')}
          style={{ minWidth: '150px', fontSize: '1.1rem' }}
        >
          📚 Teach Mode
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {mode === ('quiz' as Mode) ? 'Practice Quizzes' : 'Learn Concepts'}
        </h2>
        <p style={{ color: 'var(--secondary)' }}>
          {mode === ('quiz' as Mode) ? 'Select a category to start practicing.' : 'Choose a topic to learn the fundamentals.'}
        </p>
      </div>

      {selectedCategory ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <button 
            onClick={() => setSelectedCategory('')}
            style={{ float: 'left', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedCategory}</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--secondary)' }}>
            Configure your quiz settings.
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Number of Questions</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[5, 10, 15, 20].map(num => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`btn ${questionCount === num ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '60px' }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }} onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              title={cat.title}
              description={cat.description}
              icon={cat.icon}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </div>
      )}

      {history.length > 0 && !selectedCategory && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.slice(0, 5).map((item, i) => (
              <div key={i} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.category}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                  {item.score} / {item.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={setDifficulty}
      />
    </div>
    );
  }
}
