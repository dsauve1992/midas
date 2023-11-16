import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTradingViewContext } from "../global/TradingViewWidgetScriptLoader";

type TradingViewTapeCardProps = {
  symbol: string;
};

export default function TradingViewTapeCard({
  symbol,
}: TradingViewTapeCardProps) {
  const tradingViewReady = useTradingViewContext();
  const containerId = useMemo(() => `tradingview_${symbol}`, [symbol]);
  const onLoadScriptRef = useRef<() => void>(null);

  const createWidget = useCallback(() => {
    if ("TradingView" in window) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      return new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        withdateranges: true,
        fullscreen: true,
        // range: '1M',
        hide_side_toolbar: true,
        allow_symbol_change: false,
        details: false,
        hotlist: false,
        calendar: false,
        container_id: containerId,
      });
    }

    return null;
  }, [containerId, symbol]);

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
