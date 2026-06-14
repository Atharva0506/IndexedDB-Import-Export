import { assertBrowser } from './ssr.js';

/**
 * Trigger a browser download of a JSON-serializable value as a file.
 *
 * The value is stringified with 2-space indentation and downloaded with
 * MIME type `application/json`.
 *
 * Generic over the input type so it can be used with any JSON-safe value.
 *
 * @param data - The value to serialize and download.
 * @param filename - The filename suggested to the browser (e.g. "backup.json").
 *
 * @throws If called outside a browser environment.
 *
 * @example
 * ```typescript
 * const backup = await exportDB({ dbName: 'my-app-db' });
 * downloadJSON(backup, 'my-app-backup.json');
 * ```
 */
export function downloadJSON<T>(data: T, filename: string): void {
  assertBrowser('downloadJSON');

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Read a File (from an <input type="file"> element) and parse it as JSON.
 *
 * Generic over the return type so callers can narrow it (e.g. to ExportFormat)
 * at the call site.
 *
 * @param file - The File object to read.
 * @returns A promise that resolves to the parsed JSON value.
 *
 * @throws If the file cannot be read, or its contents are not valid JSON.
 *
 * @example
 * ```typescript
 * const input = document.querySelector('input[type=file]') as HTMLInputElement;
 * const file = input.files![0];
 * const backup = await readFileAsJSON<ExportFormat>(file);
 * await importDB({ dbName: 'my-app-db', backupData: backup, strategy: 'merge' });
 * ```
 */
export function readFileAsJSON<T = unknown>(file: File): Promise<T> {
  assertBrowser('readFileAsJSON');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        resolve(JSON.parse(text) as T);
      } catch (error) {
        reject(new Error(`Failed to parse JSON from file "${file.name}": ${String(error)}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file "${file.name}": ${String(reader.error)}`));
    };

    reader.readAsText(file);
  });
}
