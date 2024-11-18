import { useCallback, useState } from 'react';

const useWithErrorHandling = <TArgs extends any[], TResponse>(
  fn: (...args: TArgs) => Promise<TResponse>,
  defaultError = 'Error'
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fnWithErrorHandling = useCallback(
    async (...args: TArgs): Promise<TResponse | null> => {
      try {
        setLoading(true);
        const response = await fn(...args);
        setError('');
        setLoading(false);
        return response;
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
          setError(err.message);
        }
        if (typeof err === 'string') {
          setError(err);
        } else {
          setError(defaultError);
        }
        return null;
      }
    },
    [fn, defaultError]
  );

  return [fnWithErrorHandling, loading, error] as const;
};

export default useWithErrorHandling;
