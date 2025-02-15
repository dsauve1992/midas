import { OngoingPosition } from '../../domain/model/ongoing-position';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';

export class OngoingPositionPostgresDbRepository
  implements OngoingPositionRepository
{
  getAll(): Promise<OngoingPosition[]> {
    throw new Error('Method not implemented.');
  }

  save(position: OngoingPosition): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
