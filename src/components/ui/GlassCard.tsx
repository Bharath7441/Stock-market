import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  animate = true 
}) => {
  return (
    <div 
      className={`
        backdrop-blur-xl bg-white/10 dark:bg-white/5 
        border border-white/20 dark:border-blue-300/20
        rounded-3xl p-6 shadow-2xl
        transition-all duration-300 ease-out
        hover:shadow-blue-500/10 hover:border-white/30 dark:hover:border-blue-300/30
        ${animate ? 'opacity-0 translate-y-4 animate-fade-in-up' : ''}
        ${className}
      `}
      style={{
        backdropFilter: 'blur(12px)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }}
    >
      {children}
    </div>
  );
};