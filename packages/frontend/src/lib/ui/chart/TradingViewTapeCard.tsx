import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTradingViewContext } from "../global/TradingViewWidgetScriptLoader.tsx";

type TradingViewTapeCardProps = {
  symbol: string;
  interval?: "D" | "15";
  range?: "1M" | "2M" | "3M" | "6M" | "12M";
  withDateRanges?: boolean;
  hideTopToolbar?: boolean;
};

export default function TradingViewTapeCard({
  symbol,
  interval = "D",
  range = "6M",
  withDateRanges = true,
  hideTopToolbar = false,
}: TradingViewTapeCardProps) {
  const tradingViewReady = useTradingViewContext();
  const containerId = useMemo(
    () => `tradingview_${symbol}_${interval}`,
    [interval, symbol],
  );
  const onLoadScriptRef = useRef<() => void>(null);

  const createWidget = useCallback(() => {
    if ("TradingView" in window) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      return new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        withdateranges: withDateRanges,
        hide_top_toolbar: hideTopToolbar,
        fullscreen: true,
        studies: [
          {
            id: "MAExp@tv-basicstudies",
            version: 60,
            inputs: {
              length: 10,
            },
          },
          {
            id: "MAExp@tv-basicstudies",
            version: 60,
            inputs: {
              length: 20,
            },
          },
        ],
        range,
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        hotlist: false,
        calendar: false,
        container_id: containerId,
      });
    }

    return null;
  }, [containerId, hideTopToolbar, interval, range, symbol, withDateRanges]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onLoadScriptRef.current = createWidget;
    onLoadScriptRef.current();

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onLoadScriptRef.current = null;
    };
  }, [createWidget, symbol, tradingViewReady]);

  return <div id={containerId} style={{ height: "100%" }} />;
}
