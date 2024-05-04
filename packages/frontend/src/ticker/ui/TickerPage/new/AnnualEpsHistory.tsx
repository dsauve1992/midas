import { EChartOption } from "echarts";
import { useEchart } from "../../../../lib/ui/chart/hooks/useEchart.ts";
import { useMemo } from "react";
import CartesianAxis = echarts.EChartOption.BasicComponents.CartesianAxis;

type Props = {
  history: {
    year: number;
    value: number;
    growth: number;
    estimate: boolean;
  }[];
  position: "vertical" | "horizontal";
};

export const AnnualEpsHistory = ({ history, position }: Props) => {
  const yearAxis = useMemo(
    () => [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        position: "left",
        // prettier-ignore
        data: history.map((e) => e.year),
      } as CartesianAxis,
    ],
    [history],
  );

  const epsAxis = useMemo(
    () => [
      {
        type: "value",
        name: "Eps",
        show: true,
        splitLine: {
          show: false,
        },
      } as CartesianAxis,
      {
        type: "value",
        name: "Growth",
        axisLine: {
          show: true,
        },
      } as CartesianAxis,
    ],
    [],
  );

  const options: EChartOption = {
    title: {
      show: true,
      text: "Annual EPS History",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "10%",
    },
    yAxis: position === "horizontal" ? epsAxis : yearAxis,
    xAxis: position === "horizontal" ? yearAxis : epsAxis,
    series: [
      {
        name: "current",
        type: "bar",
        data: history.map((e) => ({
          value: e.value,
          itemStyle: {
            borderType: e.estimate ? "dashed" : "solid",
            borderWidth: e.estimate ? 2 : 0,
            color: e.estimate ? "rgba(210, 70, 70, 0)" : "rgb(255,84,46)",
            borderColor: e.estimate ? "rgb(255,84,46)" : "rgba(210, 70, 70, 0)",
          },
        })),
        yAxisIndex: position === "horizontal" ? 0 : undefined,
        xAxisIndex: position === "vertical" ? 0 : undefined,
      },
      {
        name: "Growth",
        type: "line",
        yAxisIndex: position === "horizontal" ? 1 : undefined,
        xAxisIndex: position === "vertical" ? 1 : undefined,
        data: history.map((e) => e.growth),
        label: {
          show: true,
          fontWeight: "bolder",
          position: "right",
          formatter: ({ value }: { value: number }) => value.toFixed(1),
          color: "#545454",
          width: "550px",
          backgroundColor: "#00fe41",
          padding: 6,
          borderRadius: 100,
        },
      },
    ],
  };

  const epsRef = useEchart(options);

  return <div ref={epsRef} style={{ height: "100%", width: "100%" }} />;
};
