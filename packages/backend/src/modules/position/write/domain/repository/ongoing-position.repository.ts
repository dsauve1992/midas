import { OngoingPosition } from '../model/ongoing-position';

export abstract class OnGoingPositionRepository {
  abstract getAll(): Promise<OngoingPosition[]>;
}
