import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";

export interface Props extends PickersDayProps<Moment> {
  highlightedDays?: Date[];
}

export const EarningCallDay = (props: Props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    !!highlightedDays.find((day) => props.day.isSame(day, "day"));

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌚" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
};
