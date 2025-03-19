import { OngoingPosition } from '../../domain/model/ongoing-position';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OngoingPositionPostgresDbRepository
  implements OngoingPositionRepository
{
  save(position: OngoingPosition): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
