import { PositionModel } from './model/PositionModel';

export interface PositionRepository {
  getAllByUserId(userId: string): Promise<PositionModel[]>;
}
