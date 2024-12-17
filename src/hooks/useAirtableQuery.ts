import { useState, useEffect } from 'react';

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAirtableQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const execute = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const result = await queryFn();
        
        if (mounted) {
          setState({ data: result, isLoading: false, error: null });
        }
      } catch (err) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'An unknown error occurred',
          }));
        }
      }
    };

    execute();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return state;
}