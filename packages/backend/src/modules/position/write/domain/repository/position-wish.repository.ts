import { PositionWish } from '../model/position-wish';
import { PositionId } from '../model/position-id';

export interface PositionWishRepository {
  save(positionWish: PositionWish): Promise<void>;

  getById(id: PositionId): Promise<PositionWish>;
}
