import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import {
  EnterpriseRatio,
  IncomeStatementDto,
} from '../../../../shared-types/financial-modeling-prep';

const mockGetIncomeStatement = jest.fn<
  Promise<Partial<IncomeStatementDto>[]>,
  any
>();
const mockGetEnterpriseRatios = jest.fn<
  Promise<Partial<EnterpriseRatio>[]>,
  any
>();
describe('RatingProcessorRunnerService', () => {
  let service: RatingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        RatingService,
        {
          provide: FinancialModelingPrepService,
          useFactory: jest.fn().mockImplementation(() => ({
            getIncomeStatements: mockGetIncomeStatement,
            getEnterpriseRatios: mockGetEnterpriseRatios,
          })),
        },
      ],
    }).compile();

    service = app.get(RatingService);
  });

  it('should return a number', async () => {
    mockGetIncomeStatement
      .mockResolvedValueOnce([
        { period: 'Q3', calendarYear: '2021', epsdiluted: 8, revenue: 1 },
        { period: 'Q2', calendarYear: '2021', epsdiluted: 7, revenue: 2 },
        { period: 'Q1', calendarYear: '2021', epsdiluted: 6, revenue: 3 },
        { period: 'Q4', calendarYear: '2020', epsdiluted: 5, revenue: 4 },
        { period: 'Q3', calendarYear: '2020', epsdiluted: 4, revenue: 5 },
        { period: 'Q2', calendarYear: '2020', epsdiluted: 3, revenue: 6 },
        { period: 'Q1', calendarYear: '2020', epsdiluted: 2, revenue: 7 },
        { period: 'Q4', calendarYear: '2019', epsdiluted: 1, revenue: 8 },
      ])
      .mockResolvedValueOnce([
        { calendarYear: '2020', epsdiluted: 7 },
        { calendarYear: '2019', epsdiluted: 6 },
        { calendarYear: '2018', epsdiluted: 5 },
        { calendarYear: '2017', epsdiluted: 4 },
        { calendarYear: '2016', epsdiluted: 3 },
        { calendarYear: '2015', epsdiluted: 2 },
        { calendarYear: '2014', epsdiluted: 1 },
      ]);
    mockGetEnterpriseRatios.mockResolvedValue([{ returnOnEquity: 0.2 }]);

    const rating = await service.getRatingFor('BSX');

    expect(rating).toEqual(65);
  });
});
