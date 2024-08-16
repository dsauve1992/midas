import { memo, useEffect, useRef } from "react";

type TradingViewTickerWidgetProps = {
  symbol: string;
};

const TradingViewTickerWidget = (props: TradingViewTickerWidgetProps) => {
  const { symbol } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "symbol": "${symbol}",
          "width": "100%",
          "isTransparent": false,
          "colorTheme": "dark",
          "locale": "en"
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
      className="tradingview-ticker-container"
    >
      <div className="tradingview-ticker-container__widget"></div>
    </div>
  );
};

export default memo(TradingViewTickerWidget);
