import { PartialType } from '@nestjs/swagger';

import { CreateActionDto } from './create-action.dto';

/**
 * Data Transfer Object for updating an action.
 */
export class UpdateActionDto extends PartialType(CreateActionDto) {}
