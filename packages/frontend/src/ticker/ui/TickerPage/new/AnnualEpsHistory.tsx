import { EChartOption } from "echarts";
import { useEchart } from "../../../../lib/ui/chart/hooks/useEchart.ts";

type Props = {
  history: {
    year: number;
    value: number;
    growth: number;
    estimate: boolean;
  }[];
};

export const AnnualEpsHistory = ({ history }: Props) => {
  const options: EChartOption = {
    title: {
      show: true,
      text: "TEST DD",
    },
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
    // legend: {
    //     data: [previousMetricLabel, currentMetricLabel, growthMetricLabel],
    // },
    yAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        // prettier-ignore
        data: history.map((e) => e.year),
      },
    ],
    xAxis: [
      {
        type: "value",
        name: "Eps",
        show: true,
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        name: "Growth",
        axisLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: "current",
        type: "bar",
        data: history.map((e) => ({
          value: e.value,
          itemStyle: {
            borderType: e.estimate ? "dashed" : "solid",
            borderWidth: e.estimate ? 2 : 0,
            color: e.estimate ? "rgba(210, 70, 70, 0)" : "rgb(121,248,0)",
            borderColor: e.estimate ? "rgb(130,255,0)" : "rgba(210, 70, 70, 0)",
          },
        })),
        xAxisIndex: 0,
        barWidth: "10px",
      },
      {
        name: "Growth",
        type: "line",
        xAxisIndex: 1,
        data: history.map((e) => e.growth),
        label: {
          show: true,
          fontWeight: "bolder",
          position: "right",
          formatter: ({ value }: { value: number }) => value.toFixed(1),
          color: "#545454",
          width: "250px",
          backgroundColor: "#00fe41",
          padding: 6,
          borderRadius: 100,
        },
      },
    ],
  };

  const epsRef = useEchart(options);

  return (
    <div
      ref={epsRef}
      className="test_ds"
      style={{ height: "100%", width: "100%" }}
    />
  );
};
