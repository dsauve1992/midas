import { Module } from '@nestjs/common';
import { CreatePositionWishUseCase } from './write/usecase/create-position-wish.use-case';
import { PositionWishPostgresDbRepository } from './write/infra/repository/position-wish.postgres-db.repository';

@Module({
  providers: [
    CreatePositionWishUseCase,
    {
      provide: 'PositionWishRepository',
      useClass: PositionWishPostgresDbRepository,
    },
  ],
  imports: [],
  exports: [],
})
export class PositionModule {}
