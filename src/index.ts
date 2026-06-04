// Public API
export { exportDB } from './core/exporter.js';

// Serialization utilities
export { serialize, deserialize, BACKUP_VERSION } from './serialization/index.js';

// Types
export type {
  ExportFormat,
  ExportOptions,
  ImportOptions,
  StoreSchema,
  IndexSchema,
  TaggedValue,
} from './types/index.js';
