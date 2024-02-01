import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useTradingViewContext } from "../global/TradingViewWidgetScriptLoader.tsx";

type TradingViewTapeCardProps = {
  symbol: string;
  interval?: "D" | "15" | "60";
  range?: "1m" | "3m" | "6m" | "12m" | "5d" | "1d";
  withDateRanges?: boolean;
  hideTopToolbar?: boolean;
};

function TradingViewTapeCard({
  symbol,
  interval = "D",
  range = "12m",
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
        interval,
        range,
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

export default memo(TradingViewTapeCard);
