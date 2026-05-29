'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { PremiumQuestionnaire } from './auth/PremiumQuestionnaire';
import { WelcomeModal } from './auth/WelcomeModal';

function QuestionnaireGate() {
  const { showQuestionnaire } = useAuth();
  if (!showQuestionnaire) return null;
  return <PremiumQuestionnaire />;
}

function WelcomeGate() {
  const { showWelcomeModal, user, profile, preferences, completeWelcome } = useAuth();
  if (!showWelcomeModal || !user || !profile) return null;

  // Get city from preferences
  const city = preferences[0]?.city ?? 'San Antonio';

  return (
    <WelcomeModal
      userId={user.id}
      email={profile.email}
      city={city}
      onComplete={completeWelcome}
    />
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <QuestionnaireGate />
      <WelcomeGate />
    </AuthProvider>
  );
}
