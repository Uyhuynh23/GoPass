// src/hooks/features/auth/useAuth.ts
'use client';

import { useContext } from 'react';
import { useAuth as useAuthContext } from '@/app/contexts/AuthContext';

/**
 * Custom hook to access auth context
 * Re-export from context for cleaner imports
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
