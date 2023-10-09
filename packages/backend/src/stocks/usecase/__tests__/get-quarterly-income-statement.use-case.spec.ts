import { Test, TestingModule } from '@nestjs/testing';
import { GetQuarterlyIncomeStatementUseCase } from '../get-quarterly-income-statement.use-case';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  EnterpriseRatio,
  IncomeStatementDto,
} from '../../../../../shared-types/financial-modeling-prep';

const AAPL_QUARTERLY_INCOME_STATEMENTS = [
  {
    date: '2023-07-01',
    acceptedDate: '2023-08-03 18:04:43',
    period: 'Q3',
    revenue: 81797000000,
    epsdiluted: 1.26,
    calendarYear: '2023',
  } as IncomeStatementDto,
  {
    date: '2023-04-01',
    acceptedDate: '2023-05-04 18:03:52',
    period: 'Q2',
    revenue: 94836000000,
    epsdiluted: 1.52,
    calendarYear: '2023',
  } as IncomeStatementDto,
  {
    date: '2022-12-31',
    acceptedDate: '2023-02-02 18:01:30',
    period: 'Q1',
    revenue: 117154000000,
    epsdiluted: 1.88,
    calendarYear: '2023',
  } as IncomeStatementDto,
  {
    date: '2022-09-24',
    acceptedDate: '2022-10-27 18:01:14',
    period: 'Q4',
    revenue: 90146000000,
    epsdiluted: 1.29,
    calendarYear: '2022',
  } as IncomeStatementDto,
  {
    date: '2022-06-25',
    acceptedDate: '2022-07-28 18:06:56',
    period: 'Q3',
    revenue: 82959000000,
    epsdiluted: 1.2,
    calendarYear: '2022',
  } as IncomeStatementDto,
  {
    date: '2022-03-26',
    acceptedDate: '2022-04-28 18:03:58',
    period: 'Q2',
    revenue: 97278000000,
    epsdiluted: 1.52,
    calendarYear: '2022',
  } as IncomeStatementDto,
  {
    date: '2021-12-25',
    acceptedDate: '2022-01-27 18:00:58',
    period: 'Q1',
    revenue: 123945000000,
    epsdiluted: 2.1,
    calendarYear: '2022',
  } as IncomeStatementDto,
  {
    date: '2021-09-25',
    acceptedDate: '2021-10-28 18:04:28',
    period: 'Q4',
    revenue: 83360000000,
    epsdiluted: 1.24,
    calendarYear: '2021',
  } as IncomeStatementDto,
];

const AAPL_QUARTERLY_RATIOS = [
  {
    date: '2023-07-01',
    period: 'Q3',
    calendarYear: '2023',
    netProfitMargin: 0.24305292370135825,
  } as EnterpriseRatio,
  {
    date: '2023-04-01',
    period: 'Q2',
    calendarYear: '2023',
    netProfitMargin: 0.25475557805052934,
  } as EnterpriseRatio,
  {
    date: '2022-12-31',
    period: 'Q1',
    calendarYear: '2023',
    netProfitMargin: 0.2560561312460522,
  } as EnterpriseRatio,
  {
    date: '2022-09-24',
    period: 'Q4',
    calendarYear: '2022',
    netProfitMargin: 0.22986044860559537,
  } as EnterpriseRatio,
  {
    date: '2022-06-25',
    period: 'Q3',
    calendarYear: '2022',
    netProfitMargin: 0.2343567304331055,
  } as EnterpriseRatio,
  {
    date: '2022-03-26',
    period: 'Q2',
    calendarYear: '2022',
    netProfitMargin: 0.25709821336787353,
  } as EnterpriseRatio,
  {
    date: '2021-12-25',
    period: 'Q1',
    calendarYear: '2022',
    netProfitMargin: 0.2793981201339304,
  } as EnterpriseRatio,
  {
    date: '2021-09-25',
    period: 'Q4',
    calendarYear: '2021',
    netProfitMargin: 0.2465331094049904,
  } as EnterpriseRatio,
];

describe('GetQuarterlyIncomeStatementUseCase specs', () => {
  let useCase: GetQuarterlyIncomeStatementUseCase;
  let financialModelingPrepService: DeepMocked<FinancialModelingPrepService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        GetQuarterlyIncomeStatementUseCase,
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    useCase = app.get(GetQuarterlyIncomeStatementUseCase);
    financialModelingPrepService = app.get(FinancialModelingPrepService);
  });

  it('should return history of income statement', async () => {
    financialModelingPrepService.getIncomeStatements.mockResolvedValue(
      AAPL_QUARTERLY_INCOME_STATEMENTS,
    );

    financialModelingPrepService.getEnterpriseRatios.mockResolvedValue(
      AAPL_QUARTERLY_RATIOS,
    );

    const incomeStatementGrowthHistory = await useCase.execute('AAPL');

    expect(
      incomeStatementGrowthHistory.map((entry) => entry.toString()),
    ).toEqual([
      'Q3 - 2023 : Earnings : 1.26 (5%)} | Sales : 81797000000 (-1.4%)} | Net Profit Margin : 0.24305292370135825',
      'Q2 - 2023 : Earnings : 1.52  | Sales : 94836000000 (-2.51%)} | Net Profit Margin : 0.25475557805052934',
      'Q1 - 2023 : Earnings : 1.88 (-10.5%)} | Sales : 117154000000 (-5.48%)} | Net Profit Margin : 0.2560561312460522',
      'Q4 - 2022 : Earnings : 1.29 (4.03%)} | Sales : 90146000000 (8.14%)} | Net Profit Margin : 0.22986044860559537',
      'Q3 - 2022 : Earnings : 1.2  | Sales : 82959000000  | Net Profit Margin : 0.2343567304331055',
      'Q2 - 2022 : Earnings : 1.52  | Sales : 97278000000  | Net Profit Margin : 0.25709821336787353',
      'Q1 - 2022 : Earnings : 2.1  | Sales : 123945000000  | Net Profit Margin : 0.2793981201339304',
      'Q4 - 2021 : Earnings : 1.24  | Sales : 83360000000  | Net Profit Margin : 0.2465331094049904',
    ]);
  });

  it('should fill missing statements', async () => {
    const AAPL_QUARTERLY_INCOME_STATEMENTS_WITH_MISSING_QUARTER = [
      ...AAPL_QUARTERLY_INCOME_STATEMENTS,
    ];
    AAPL_QUARTERLY_INCOME_STATEMENTS_WITH_MISSING_QUARTER.splice(3, 1);

    financialModelingPrepService.getIncomeStatements.mockResolvedValue(
      AAPL_QUARTERLY_INCOME_STATEMENTS_WITH_MISSING_QUARTER,
    );

    const AAPL_QUARTERLY_RATIOS_WITH_MISSING_QUARTER = [
      ...AAPL_QUARTERLY_RATIOS,
    ];
    AAPL_QUARTERLY_RATIOS_WITH_MISSING_QUARTER.splice(5, 1);

    financialModelingPrepService.getEnterpriseRatios.mockResolvedValue(
      AAPL_QUARTERLY_RATIOS_WITH_MISSING_QUARTER,
    );

    const incomeStatementGrowthHistory = await useCase.execute('AAPL');

    expect(
      incomeStatementGrowthHistory.map((entry) => entry.toString()),
    ).toEqual([
      'Q3 - 2023 : Earnings : 1.26 (5%)} | Sales : 81797000000 (-1.4%)} | Net Profit Margin : 0.24305292370135825',
      'Q2 - 2023 : Earnings : 1.52  | Sales : 94836000000 (-2.51%)} | Net Profit Margin : 0.25475557805052934',
      'Q1 - 2023 : Earnings : 1.88 (-10.5%)} | Sales : 117154000000 (-5.48%)} | Net Profit Margin : 0.2560561312460522',
      'Q4 - 2022 : Missing Data',
      'Q3 - 2022 : Earnings : 1.2  | Sales : 82959000000  | Net Profit Margin : 0.2343567304331055',
      'Q2 - 2022 : Earnings : 1.52  | Sales : 97278000000  | Net Profit Margin : undefined',
      'Q1 - 2022 : Earnings : 2.1  | Sales : 123945000000  | Net Profit Margin : 0.2793981201339304',
      'Q4 - 2021 : Earnings : 1.24  | Sales : 83360000000  | Net Profit Margin : 0.2465331094049904',
    ]);
  });
});
