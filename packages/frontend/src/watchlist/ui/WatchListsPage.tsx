import { Card, CardContent, Grid, List } from "@mui/material";
import { TickerProfile } from "../../ticker/ui/TickerPage/header/TickerProfile";
import VitalSection from "../../ticker/ui/TickerPage/header/vital/VitalSection";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";
import { useCompanyGeneralInformation } from "../../ticker/ui/hooks/useCompanyGeneralInformation.ts";
import { LoadingBox } from "../../lib/ui/global/component/LoadingBox.tsx";

export const WatchListsPage = () => {
  const { data: symbols } = useGetWatchlist();

  return (
    <>
      <List>
        {symbols?.map((el) => <WatchListTicker symbol={el} key={el} />)}
      </List>
    </>
  );
};

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
  const { isLoading: profileLoading, data: profile } =
    useCompanyGeneralInformation(symbol!);

  return (
    <Card>
      <CardContent sx={{ height: "450px" }}>
        {profileLoading ? (
          <LoadingBox />
        ) : (
          <Grid container spacing={2} height="100%" alignItems="center">
            <Grid item xs={3} justifyContent="center">
              <TickerProfile profile={profile!} />
            </Grid>
            <Grid item xs={3}>
              <VitalSection symbol={symbol} itemCol={12} size="sm" />
            </Grid>
            <Grid item xs={6} height="100%">
              <TradingViewTapeCard symbol={symbol} />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
