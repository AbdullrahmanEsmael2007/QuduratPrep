'use client';

import { useState } from 'react';
import CategoryCard from './CategoryCard';
import Lesson from './Lesson';

export default function TeachMode() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'Odd One Out', title: 'Odd One Out', description: 'Learn how to identify the different word.', icon: '📚' },
    { id: 'Analogy', title: 'Analogy', description: 'Master relationship patterns and pairs.', icon: '🔗' },
    { id: 'Non-Logical Word', title: 'Non-Logical Word', description: 'Detect words that break sentence logic.', icon: '🔍' },
    { id: 'Paragraph Meaning', title: 'Paragraph Meaning', description: 'Find the main idea in paragraphs.', icon: '📖' },
  ];

  if (selectedCategory) {
    return (
      <Lesson 
        category={selectedCategory} 
        onBack={() => setSelectedCategory('')}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Teach Mode</h1>
        <p style={{ color: 'var(--secondary)' }}>Learn the logic behind each question type.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
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
    </div>
  );
}
