/**
 * Frontend Developer - UI Components
 * 
 * Reusable UI components that can be used across the application.
 * These components focus on presentation and user interaction.
 */

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          ⟳
        </span>
      )}
      <span className={loading ? styles.hidden : ''}>
        {children}
      </span>
    </button>
  );
};

// Frontend Developer Responsibilities:
// - Create consistent, reusable components
// - Implement proper accessibility features
// - Handle loading states and user feedback
// - Ensure responsive design
// - Maintain design system consistency
