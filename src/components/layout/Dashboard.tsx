/**
 * Frontend Developer Example Component
 * 
 * This file demonstrates the responsibilities and patterns
 * for frontend developers working on the TryDo application.
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './forms/Input';
import styles from '../styles/components/Dashboard.module.css';

// Frontend Developer Responsibilities:
// 1. Create reusable UI components
// 2. Implement responsive design
// 3. Handle client-side state management
// 4. Ensure accessibility compliance
// 5. Optimize for performance

interface DashboardProps {
  userId: string;
  onUserUpdate?: (user: User) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId, onUserUpdate }) => {
  // Frontend state management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Frontend developer handles UI state and user interactions
  useEffect(() => {
    // This would typically call a hook from react-database developer
    // For now, we'll simulate the data
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({
          id: userId,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/default-avatar.png'
        });
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Frontend developer handles UI interactions
  const handleNameUpdate = (newName: string) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      onUserUpdate?.(updatedUser);
    }
  };

  // Frontend developer ensures responsive design
  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome back, {user?.name}!</h1>
        <div className={styles.avatar}>
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt={`${user?.name}'s avatar`}
            className={styles.avatarImage}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Card className={styles.profileCard}>
            <h2>Profile Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name:</label>
              <Input
                id="name"
                value={user?.name || ''}
                onChange={(e) => handleNameUpdate(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                placeholder="Email address"
              />
            </div>
          </Card>

          <Card className={styles.statsCard}>
            <h2>Quick Stats</h2>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Tasks Completed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>3</span>
                <span className={styles.statLabel}>Projects Active</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Frontend Developer Notes:
// - This component focuses purely on UI/UX
// - State management is handled locally for UI concerns
// - Data fetching would be handled by react-database developer
// - Styling uses CSS modules for component isolation
// - Accessibility features are built-in (labels, alt text, etc.)
// - Responsive design is implemented with CSS Grid/Flexbox
