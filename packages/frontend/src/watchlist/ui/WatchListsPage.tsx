import { Card, CardContent, Grid } from "@mui/material";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";
import { AutoSizer, List } from "react-virtualized";
import { ListRowRenderer } from "react-virtualized/dist/es/List";

export const WatchListsPage = () => {
  const { data: symbols } = useGetWatchlist();

  const rowRender: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div style={style} key={key}>
        <WatchListTicker symbol={symbols?.[index] || ""} />
      </div>
    );
  };

  return (
    <>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref="List"
            height={height}
            rowCount={symbols?.length || 0}
            overscanRowCount={10}
            rowHeight={800}
            rowRenderer={rowRender}
            width={width}
          />
        )}
      </AutoSizer>
    </>
  );
};

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Grid container spacing={2} height="100%" alignItems="center">
          <Grid item xs={6} height="100%">
            <TradingViewTapeCard symbol={symbol} interval={"D"} range={"3m"} />
          </Grid>
          <Grid item xs={6} height="100%">
            <TradingViewTapeCard symbol={symbol} interval="60" range={"5d"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
