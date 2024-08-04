import { useEchart } from "../../../../../lib/ui/chart/hooks/useEchart.ts";
import { EChartOption } from "echarts";

export type MetricComparison = {
  period: string | number;
  current?: number;
  previous?: number;
  growth?: number;
};

type MetricComparisonChartProps = {
  title: string;
  currentMetricLabel?: string;
  previousMetricLabel?: string;
  growthMetricLabel?: string;
  data: MetricComparison[];
  options?: {
    size: "small" | "large";
  };
};

const style = { height: "100%", width: "100%" };
export const MetricComparisonChart = ({
  title,
  currentMetricLabel = "Current",
  previousMetricLabel = "Previous",
  growthMetricLabel = "",
  data,
}: MetricComparisonChartProps) => {
  const options: EChartOption = {
    title: {
      show: false,
      text: title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      top: "20%",
      left: "10%",
      right: "15%",
      bottom: "20%",
    },
    xAxis: {
      type: "category",
      axisTick: {
        alignWithLabel: true,
      },
      // prettier-ignore
      data: data.map((e) => e.period),
    },
    yAxis: [
      {
        type: "value",
        name: title,
        position: "right",
        show: true,
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        name: growthMetricLabel,
        position: "left",
        axisLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: previousMetricLabel,
        type: "bar",
        data: data.map((e) => e.previous),
      },
      {
        name: currentMetricLabel,
        type: "bar",
        data: data.map((e) => e.current),
      },
      {
        name: growthMetricLabel,
        type: "line",
        yAxisIndex: 1,
        data: data.map((e) => e.growth),
        label: {
          show: true,
          fontWeight: "bolder",
          formatter: ({ value }: { value: number }) => value.toFixed(1),
          color: "#545454",
          width: "250px",
          backgroundColor: "#00fe41",
          fontSize: 10,
          padding: 6,
          borderRadius: 100,
        },
      },
    ],
  };

  const epsRef = useEchart(options);

  return <div ref={epsRef} style={style} />;
};
