import { Module } from '@nestjs/common';
import { CreatePositionWishUseCase } from './write/usecase/create-position-wish.use-case';
import { PositionController } from './position.controller';
import { PositionWishPostgresDbRepository } from './write/infra/repository/position-wish.postgres-db.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PositionController],
  providers: [
    CreatePositionWishUseCase,
    {
      provide: 'PositionWishRepository',
      useClass: PositionWishPostgresDbRepository,
    },
  ],
  exports: [],
})
export class PositionModule {}
