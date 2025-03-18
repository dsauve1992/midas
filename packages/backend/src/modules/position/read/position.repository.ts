import { PositionModel } from './model/PositionModel';
import { UserId } from '../../user/domain/UserId';

export interface PositionRepository {
  getAllByUserId(userId: UserId): Promise<PositionModel[]>;
}
