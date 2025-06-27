import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-2xl
    transition-all duration-300 ease-out
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-blue-400/50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
      text-white shadow-lg hover:shadow-blue-500/25
      border border-blue-500/50 hover:border-blue-400/75
    `,
    secondary: `
      backdrop-blur-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10
      text-gray-800 dark:text-white border border-white/20 dark:border-blue-300/20
      hover:border-white/30 dark:hover:border-blue-300/30
    `,
    ghost: `
      text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white
      hover:bg-white/10 dark:hover:bg-white/5
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};