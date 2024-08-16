import { memo, useEffect, useRef } from "react";

type TradingViewSimpleDailyTapeCardProps = {
  symbol: string;
};

const TradingViewSimpleDailyTapeCardWidget = (
  props: TradingViewSimpleDailyTapeCardProps,
) => {
  const { symbol } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "symbols": [
            [
              "${symbol}|6m"
            ]
          ],
          "width": "100%",
          "height": "100%",
          "chartOnly": false,
          "locale": "en",
          "colorTheme": "dark",
          "autosize": true,
          "showVolume": true,
          "showMA": true,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "3",
          "changeMode": "price-and-percent",
          "chartType": "candlesticks",
          "maLineColor": "rgba(41, 98, 255, 1)",
          "maLineWidth": 1,
          "maLength": 20,
          "lineType": 0,
          "dateRanges": [
            "3m|1D",
            "6m|1D",
            "12m|1D"
          ],
          "upColor": "#22ab94",
          "downColor": "#f7525f",
          "borderUpColor": "#22ab94",
          "borderDownColor": "#f7525f",
          "wickUpColor": "#22ab94",
          "wickDownColor": "#f7525f"
        }`;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
      }
    };
  }, [symbol]);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={container}
      id={`tradingview_simple_tape_${symbol}`}
      className="tradingview-widget-container"
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default memo(TradingViewSimpleDailyTapeCardWidget);
