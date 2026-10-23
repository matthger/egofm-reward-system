import { Test, TestingModule } from '@nestjs/testing';

import { RewardClaimsController } from './reward-claims.controller';
import { RewardClaimsService } from './reward-claims.service';

describe('RewardClaimsController', () => {
  let controller: RewardClaimsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardClaimsController],
      providers: [RewardClaimsService],
    }).compile();

    controller = module.get<RewardClaimsController>(RewardClaimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
