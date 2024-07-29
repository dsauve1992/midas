const contrastColor = "#eee";

const axisCommon = function () {
  return {
    axisLine: {
      lineStyle: {
        color: contrastColor,
      },
    },
    axisBar: {
      lineStyle: {
        color: contrastColor,
      },
    },
    axisTick: {
      lineStyle: {
        color: contrastColor,
      },
    },
    axisLabel: {
      textStyle: {
        color: contrastColor,
        fontSize: 8,
      },
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "#aaa",
      },
    },
    splitArea: {
      areaStyle: {
        color: contrastColor,
      },
    },
  };
};

const theme = {
  seriesCnt: "4",
  backgroundColor: "rgba(52,52,52,1)",
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: contrastColor,
      },
      crossStyle: {
        color: contrastColor,
      },
      label: {
        color: "#000",
        fontSize: 8,
      },
    },
  },
  legend: {
    textStyle: {
      color: contrastColor,
      fontSize: 8,
    },
  },
  title: {
    textStyle: {
      color: contrastColor,
      fontSize: 8,
    },
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: contrastColor,
      },
    },
  },
  titleColor: "#ffffff",
  subtitleColor: "#aaaaaa",
  textColorShow: false,
  textColor: "#333",
  markTextColor: "#585858",
  color: ["#ff542e", "#00f9f6", "#00fe41", "#fffe00", "#0048ff", "#e600ff"],
  borderColor: "#ccc",
  borderWidth: 0,
  visualMapColor: ["#f50505", "#e09898", "#00c1ff"],
  legendTextColor: "#c3c3c3",
  kColor: "#00fe41",
  kColor0: "#ff0000",
  kBorderColor: "#00fe41",
  kBorderColor0: "#ff0000",
  kBorderWidth: "2",
  lineWidth: "3",
  symbolSize: "7",
  symbol: "roundRect",
  symbolBorderWidth: "2",
  lineSmooth: true,
  graphLineWidth: 1,
  graphLineColor: "#aaaaaa",
  mapLabelColor: "#000",
  mapLabelColorE: "#ffffff",
  mapBorderColor: "#444",
  mapBorderColorE: "#444",
  mapBorderWidth: 0.5,
  mapBorderWidthE: 1,
  mapAreaColor: "#eee",
  mapAreaColorE: "#e098c7",
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),
  axisSeperateSetting: true,
  toolboxColor: "#999999",
  toolboxEmphasisColor: "#666666",
  tooltipAxisColor: "#cccccc",
  tooltipAxisWidth: 1,
  timelineLineColor: "#8fd3e8",
  timelineLineWidth: 1,
  timelineItemColor: "#8fd3e8",
  timelineItemColorE: "#8fd3e8",
  timelineCheckColor: "#8fd3e8",
  timelineCheckBorderColor: "rgba(138,124,168,1)",
  timelineItemBorderWidth: 1,
  timelineControlColor: "#8fd3e8",
  timelineControlBorderColor: "#8fd3e8",
  timelineControlBorderWidth: 0.5,
  timelineLabelColor: "#8fd3e8",
  datazoomBackgroundColor: "rgba(235,235,235,0)",
  datazoomDataColor: "rgba(255,255,255,0.3)",
  datazoomFillColor: "rgba(167,183,204,0.4)",
  datazoomHandleColor: "#a7b7cc",
  datazoomHandleWidth: "100",
  datazoomLabelColor: "#333333",
};

export default theme;
