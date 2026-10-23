import { PartialType } from '@nestjs/swagger';

import { CreateRewardClaimDto } from './create-reward-claim.dto';

/**
 * Data Transfer Object for updating a reward claim.
 */
export class UpdateRewardClaimDto extends PartialType(CreateRewardClaimDto) {}
