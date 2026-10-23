import { PartialType } from '@nestjs/swagger';

import { CreateRewardDto } from './create-reward.dto';

/**
 * Data Transfer Object for updating an existing reward.
 */
export class UpdateRewardDto extends PartialType(CreateRewardDto) {}
