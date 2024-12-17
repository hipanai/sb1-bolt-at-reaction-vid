import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`bg-white rounded-lg shadow-md p-6 mb-8 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </section>
  );
}