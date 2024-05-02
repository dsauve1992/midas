import { EChartOption } from "echarts";
import { useEchart } from "../../../../../../lib/ui/chart/hooks/useEchart.ts";

export interface InstitutionalOwnershipHistoryByQuarterDataEntry {
  period: string;
  value: number;
}

interface Props {
  data: InstitutionalOwnershipHistoryByQuarterDataEntry[];
}

export const InstitutionalOwnershipHistoryByQuarterBarChart = ({
  data,
}: Props) => {
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
    legend: {
      data: ["Institutional Sponsorship"],
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: data.map((q) => q.period),
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Institutional Sponsorship",
        position: "right",
        show: true,
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "Institutional Sponsorship",
        type: "bar",
        data: data.map((q) => q.value),
      },
    ],
  };

  const epsRef = useEchart(options);

  return <div ref={epsRef} style={{ height: "100%", width: "100%" }} />;
};
