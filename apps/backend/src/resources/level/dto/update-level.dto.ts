import { PartialType } from '@nestjs/swagger';

import { CreateLevelDto } from './create-level.dto';

/**
 * Data Transfer Object for updating an existing level.
 */
export class UpdateLevelDto extends PartialType(CreateLevelDto) {}
