'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] grid place-items-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm opacity-70">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-md border"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
