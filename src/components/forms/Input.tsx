/**
 * Frontend Developer - Input Component
 * 
 * Reusable input component for forms.
 */

import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  id?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  required = false
}) => {
  const inputClasses = [
    styles.input,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange || (() => {})}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={inputClasses}
    />
  );
};
