import React from "react";
import { Card, CardContent } from "@mui/material";
import { EChartOption } from "echarts";
import type { InsiderTradingEvent } from "backend/src/shared-types/financial-modeling-prep";
import { useEchart } from "../../../../../lib/ui/chart/hooks/useEchart";
import DateRange from "../../../../../lib/utils/date/DateRange";

export interface Props {
  events: InsiderTradingEvent[];
}

const InsiderActivityHistoryChart: React.FunctionComponent<Props> = ({
  events,
}: Props) => {
  const firstEventDate = new Date(events[events.length - 1].transactionDate);
  const lastEventDate = new Date(events[0].transactionDate);
  const range = DateRange.fromString(firstEventDate, lastEventDate);

  const options: EChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "20%",
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ["Purchase events", "Sales events"],
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: range,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Insider Trading events",
        position: "right",
        show: true,
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "Purchase events",
        type: "bar",
        data: range.map((date) => {
          const purchaseEventsAtThatDate = events
            .filter(({ transactionDate }) => transactionDate === date)
            .filter(({ transactionType }) => transactionType === "P-Purchase");

          return purchaseEventsAtThatDate.reduce(
            (acc, curr) => acc + curr.securitiesTransacted,
            0,
          );
        }),
      },
      {
        name: "Sales events",
        type: "bar",
        data: range.map((date) => {
          const purchaseEventsAtThatDate = events
            .filter(({ transactionDate }) => transactionDate === date)
            .filter(({ transactionType }) => transactionType === "S-Sale");

          return purchaseEventsAtThatDate.reduce(
            (acc, curr) => acc - curr.securitiesTransacted,
            0,
          );
        }),
      },
    ],
    dataZoom: [{ type: "slider", show: true }, { type: "inside" }],
  };

  const ref = useEchart(options);
  return (
    <Card>
      <CardContent>
        <div ref={ref} style={{ height: 400, width: "100%" }} />
      </CardContent>
    </Card>
  );
};

export default InsiderActivityHistoryChart;
