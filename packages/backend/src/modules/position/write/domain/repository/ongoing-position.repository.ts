import { OngoingPosition } from '../model/ongoing-position';

export interface OngoingPositionRepository {
  getAll(): Promise<OngoingPosition[]>;

  save(position: OngoingPosition): Promise<void>;
}
