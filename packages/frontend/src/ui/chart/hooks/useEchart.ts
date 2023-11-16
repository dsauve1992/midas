import { useEffect, useRef } from "react";
import echarts, { EChartOption } from "echarts";
import useSize from "@react-hook/size";
import theme from "../../global/theme/echart.theme";

echarts.registerTheme("myTheme", theme);

export const useEchart = (options: EChartOption) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useSize(ref);

  useEffect(() => {
    if (ref.current) {
      const myChart = echarts.init(ref.current, "myTheme");

      myChart.setOption(options);
    }
  }, [options]);

  useEffect(() => {
    const chart = ref.current && echarts.getInstanceByDom(ref.current);
    if (chart) {
      chart.resize();
    }
  }, [width, height]);

  return ref;
};
