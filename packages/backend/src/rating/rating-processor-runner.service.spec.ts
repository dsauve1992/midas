import { Test, TestingModule } from '@nestjs/testing';
import { RatingProcessorRunnerService } from './rating-processor-runner.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FinancialModelingPrepFetcherClient } from '../financial-modeling-prep/financial-modeling-prep-fetcher-client.service';
import {
  EnterpriseRatio,
  IncomeStatement,
} from '../financial-modeling-prep/types';

const mockGetIncomeStatement = jest.fn<
  Promise<Partial<IncomeStatement>[]>,
  any
>();
const mockGetEnterpriseRatios = jest.fn<
  Promise<Partial<EnterpriseRatio>[]>,
  any
>();
describe('RatingProcessorRunnerService', () => {
  let service: RatingProcessorRunnerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        RatingProcessorRunnerService,
        {
          provide: FinancialModelingPrepFetcherClient,
          useFactory: jest.fn().mockImplementation(() => ({
            getIncomeStatements: mockGetIncomeStatement,
            getEnterpriseRatios: mockGetEnterpriseRatios,
          })),
        },
      ],
    }).compile();

    service = app.get(RatingProcessorRunnerService);
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

    const rating = await service.computeRatingFor('BSX');

    expect(rating.quarterlyIncomeSummary.toString()).toEqual(
      `Q3 - 2021 | eps: 100.00% | sales: -80.00%
       Q2 - 2021 | eps: 133.33% | sales: -66.67%
       Q1 - 2021 | eps: 200.00% | sales: -57.14%
       Q4 - 2020 | eps: 400.00% | sales: -50.00%`.replace(/  +/g, ''),
    );

    expect(rating.annuallyIncomeSummary.toString()).toEqual(
      `2020 | eps: 16.67%
       2019 | eps: 20.00%
       2018 | eps: 25.00%
       2017 | eps: 33.33%
       2016 | eps: 50.00%`.replace(/  +/g, ''),
    );

    expect(rating.returnOnEquity).toEqual(0.2);
  });
});
