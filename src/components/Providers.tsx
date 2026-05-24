'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { PremiumQuestionnaire } from './auth/PremiumQuestionnaire';

function QuestionnaireGate() {
  const { showQuestionnaire } = useAuth();
  if (!showQuestionnaire) return null;
  return <PremiumQuestionnaire />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <QuestionnaireGate />
    </AuthProvider>
  );
}
