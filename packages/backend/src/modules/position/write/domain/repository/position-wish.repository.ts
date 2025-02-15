import { PositionWish } from '../model/position-wish';

export interface PositionWishRepository {
  save(positionWish: PositionWish): Promise<void>;

  getAllByUserId(userId: string): Promise<PositionWish[]>;
}
