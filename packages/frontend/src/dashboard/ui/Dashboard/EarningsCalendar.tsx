import { Moment } from "moment";
import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";
import { EarningCallDay, Props } from "./EarningCallDay.tsx";

export const EarningsCalendar = () => {
  const handleOnMonthChange = (date: Moment) => {
    console.log(date);
  };

  return (
    <DateCalendar
      loading={false}
      slots={{
        day: EarningCallDay,
      }}
      slotProps={{
        day: {
          highlightedDays: [1, 2, 3],
        } as Partial<Props>,
      }}
      renderLoading={() => <DayCalendarSkeleton />}
      onMonthChange={handleOnMonthChange}
      views={["day"]}
    />
  );
};
