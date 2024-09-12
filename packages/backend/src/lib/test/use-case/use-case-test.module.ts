import { Module } from '@nestjs/common';
import { DummyUnitOfWork } from '../../unit-of-work/dummy-unit-of-work.service';

@Module({
  controllers: [],
  providers: [
    {
      provide: 'UNIT_OF_WORK',
      useClass: DummyUnitOfWork,
    },
  ],
  exports: ['UNIT_OF_WORK'],
})
export class UseCaseTestModule {}
