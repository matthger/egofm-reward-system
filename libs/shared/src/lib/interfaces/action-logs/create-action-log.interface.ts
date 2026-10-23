import { ActionLogMetadata } from './action-log-metadata.interface';

/**
 * The CreateActionLog interface defines the structure for creating a new action log.
 * It includes the user ID, action ID, and optional metadata.
 */
export interface CreateActionLog {
  userId: string;
  actionId: string;
  metadata?: ActionLogMetadata;
}
