import { useEffect } from 'react';

const USER_ID = 'user_id';

/**
 * Custom hook to ensure a persistent user ID exists in localStorage.
 * If none exists, it generates a new UUID, stores it, and updates state.
 *
 * @param setUserId - React state setter to update the caller's component state
 */
export function useUserId(setUserId: (id: string) => void) {
  useEffect(() => {
    let stored = localStorage.getItem(USER_ID);
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem(USER_ID, stored);
    }
    setUserId(stored);
  }, [setUserId]);
}
