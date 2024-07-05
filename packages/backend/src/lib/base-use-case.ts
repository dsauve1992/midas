import { UnitOfWork } from './unit-of-work';

export abstract class BaseUseCase<T, U = void> {
  protected constructor(protected readonly unitOfWork: UnitOfWork) {}

  async execute(data: T): Promise<U> {
    await this.unitOfWork.start();
    try {
      const result = await this.executeUseCase(data);
      await this.unitOfWork.commit();

      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  protected abstract executeUseCase(data: T): Promise<U>;
}
