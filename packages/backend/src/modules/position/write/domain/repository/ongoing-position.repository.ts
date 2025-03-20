import { OngoingPosition } from '../model/ongoing-position';
import { PositionId } from '../model/position-id';

export interface OngoingPositionRepository {
  save(position: OngoingPosition): Promise<void>;

  getById(positionId: PositionId): Promise<OngoingPosition>;
}
