import { useCallback, useState } from 'react';

const ERROR_NAMES_TO_IGNORE = ['AbortError'];

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
        // ignore abort errors and continue loading
        if (err instanceof Error && ERROR_NAMES_TO_IGNORE.includes(err.name)) {
          return null;
        }
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
