import { CreateActionLog } from './create-action-log.interface';
import { ActionLogStatus } from '../../enums/action-log-status.enum';

export interface UpdateActionLog extends Partial<CreateActionLog> {
  status?: ActionLogStatus;
}
