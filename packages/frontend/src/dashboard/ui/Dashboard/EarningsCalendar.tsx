import { Moment } from "moment";
import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";
import { EarningCallDay, Props } from "./EarningCallDay.tsx";
import { useQuery } from "react-query";
import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { FmpClient } from "../../../api/FmpClient.ts";
import { useMemo } from "react";
import { uniq } from "lodash";

export const EarningsCalendar = () => {
  const instance = useApiClientInstance(FmpClient);

  const { data, isLoading } = useQuery(
    ["earning_calendar", { from: "2021-01-01", to: "2021-12-31" }],
    () =>
      instance.getAny<{ date: string; symbol: string }[]>(
        "/api/fmp/v3/earning_calendar",
      ),
  );

  const usTickerOnly = useMemo(() => {
    return (data || []).filter(({ symbol }) => !symbol.includes("."));
  }, [data]);

  const earningsDates = useMemo(() => {
    return uniq(usTickerOnly?.map(({ date }) => new Date(date)));
  }, [usTickerOnly]);

  const handleOnMonthChange = (date: Moment) => {
    console.log(date);
  };

  return (
    <DateCalendar
      loading={isLoading}
      slots={{
        day: EarningCallDay,
      }}
      slotProps={{
        day: {
          highlightedDays: earningsDates,
        } as Partial<Props>,
      }}
      renderLoading={() => <DayCalendarSkeleton />}
      onMonthChange={handleOnMonthChange}
      views={["day"]}
    />
  );
};
