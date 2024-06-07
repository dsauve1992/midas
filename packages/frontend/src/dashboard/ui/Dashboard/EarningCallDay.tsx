import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";

export interface Props extends PickersDayProps<Moment> {
  highlightedDays?: number[];
}

export const EarningCallDay = (props: Props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

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
