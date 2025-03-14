import { OngoingPosition } from '../model/ongoing-position';

export interface OngoingPositionRepository {
  save(position: OngoingPosition): Promise<void>;
}
