/**
 * Returns true if running in a browser environment with window and document available.
 *
 * Use this to gate browser-only code paths so the library no-ops safely
 * during Next.js Server-Side Rendering (SSR) or other non-browser environments.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Throws if not running in a browser environment.
 *
 * Use at the top of functions that touch DOM or browser-only APIs
 * (e.g. document, IndexedDB, URL.createObjectURL).
 *
 * @param functionName - The name of the calling function, used in the error message.
 */
export function assertBrowser(functionName: string): void {
  if (!isBrowser()) {
    throw new Error(
      `${functionName} is browser-only and cannot be called in a non-browser environment (e.g. during SSR).`
    );
  }
}
