interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export default function CategoryCard({ title, description, icon, onClick }: CategoryCardProps) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
      <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}
