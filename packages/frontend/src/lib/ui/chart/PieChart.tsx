import { useEchart } from "./hooks/useEchart.ts";
import { EChartOption } from "echarts";

const style = { height: "100%", width: "100%" };

export interface Props {
  data: { value: number; name: string }[];
}

export const PieChart = ({ data }: Props) => {
  const options: EChartOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: 10,
      top: 20,
      bottom: 20,
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };

  const epsRef = useEchart(options);

  return <div ref={epsRef} style={style} />;
};
