import React, { useState } from "react";
import { Box, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Helmet } from "react-helmet";
import { useScreenerWithGroups } from "./hooks/useScreenerWithGroups.ts";
import BarChartIcon from "@mui/icons-material/BarChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import { FocusView } from "./FocusView.tsx";

export interface Props {}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
  const [hammerOnly, setHammerOnly] = useState<boolean>(false);
  const { tickers, isLoading } = useScreenerWithGroups({ hammerOnly });
  const [view, setView] = useState<"list" | "detail">("list");

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (tickers) {
    return (
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        <Helmet>
          <title>Screener - Midas</title>
        </Helmet>
        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          onChange={(_, value) => setView(value)}
          aria-label="text alignment"
        >
          <ToggleButton value="list" aria-label="left aligned">
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value="detail" aria-label="centered">
            <CandlestickChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Switch
          value={hammerOnly}
          onChange={(_event, checked) => setHammerOnly(checked)}
        />

        <FocusView tickers={tickers} />
        {/*<SummaryView />*/}
      </Box>
    );
  }

  return null;
};

export default ScreenerPage;
