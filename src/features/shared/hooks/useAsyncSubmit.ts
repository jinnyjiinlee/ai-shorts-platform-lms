import { useState, useCallback } from 'react';

type AsyncFunction<T = any, R = any> = (data?: T) => Promise<R>;

export function useAsyncSubmit<T = any, R = any>(
  asyncFn: AsyncFunction<T, R>,
  options?: {
    onSuccess?: (result: R) => void;
    onError?: (error: Error) => void;
  }
) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (data?: T) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const result = await asyncFn(data);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [asyncFn, options]);

  const reset = useCallback(() => {
    setSubmitting(false);
    setError(null);
  }, []);

  return {
    submitting,
    error,
    submit,
    reset,
  };
}