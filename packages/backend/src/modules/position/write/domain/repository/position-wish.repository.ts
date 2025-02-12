import { PositionWish } from '../model/position-wish';

export abstract class PositionWishRepository {
  abstract save(positionWish: PositionWish): Promise<void>;

  abstract getAll(): Promise<PositionWish[]>;
}
