'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
          <p className="text-slate-400 mb-6">
            Don&apos;t worry, we&apos;ve been notified and are working on it.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
