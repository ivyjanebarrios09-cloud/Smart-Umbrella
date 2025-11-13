'use client';

import { useState, useEffect } from 'react';
import {
  DatabaseReference,
  onValue,
  off,
  DataSnapshot,
} from 'firebase/database';

export interface UseRtdbValueResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useRtdbValue<T = any>(
  memoizedDbRef: DatabaseReference | null | undefined
): UseRtdbValueResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDbRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const listener = onValue(
      memoizedDbRef,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val() as T);
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (err: Error) => {
        // The error object from onValue is a standard Error, not a specialized FirebaseError
        console.error('Realtime Database read failed: ', err);
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    );

    // Detach the listener when the component unmounts
    return () => {
      off(memoizedDbRef, 'value', listener);
    };
  }, [memoizedDbRef]);

  return { data, isLoading, error };
}
