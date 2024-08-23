import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Helmet } from "react-helmet";
import { Grid } from "@mui/material";
import { config, TickerPageTab } from "./sections/tab.config.ts";
import { TickerProfile } from "./header/TickerProfile.tsx";
import { InvestorBusinessDailyVitalCard } from "./header/InvestorBusinessDailyVitalCard.tsx";
import VitalSection from "./header/vital/VitalSection.tsx";
import { useCompanyGeneralInformation } from "../hooks/useCompanyGeneralInformation.ts";
import TradingViewTapeCard from "../../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { PageLayout } from "../../../lib/ui/global/PageLayout.tsx";

const sx = { borderBottom: 1, borderColor: "divider" };
const TickerPage: React.FunctionComponent = () => {
  const { id: symbol } = useParams<{ id: string }>();

  const [currentTab, setCurrentTab] = useState<TickerPageTab>(config[0].id);

  const { isLoading: profileLoading, data: profile } =
    useCompanyGeneralInformation(symbol!);

  if (profileLoading) {
    return <p>Please wait...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{symbol} - Midas</title>
      </Helmet>

      <PageLayout>
        <Grid container sx={{ marginBottom: "40px" }}>
          <Grid item lg={6} md={12}>
            <Grid container>
              <Grid item xs={12} xl={6}>
                <TickerProfile profile={profile!} />
              </Grid>
              <Grid item xs={12} xl={6}>
                <InvestorBusinessDailyVitalCard symbol={symbol!} />
              </Grid>
            </Grid>
            <VitalSection profile={profile!} />
          </Grid>
          <Grid item lg={6} md={12}>
            <TradingViewTapeCard
              symbol={symbol!}
              exchange={profile!.exchangeShortName}
            />
          </Grid>
        </Grid>
        <TabContext value={currentTab}>
          <Box sx={sx}>
            <TabList onChange={(_, value) => setCurrentTab(value)}>
              {config.map(({ id, label }) => (
                <Tab key={id} label={label} value={id} />
              ))}
            </TabList>
          </Box>
          {config.map(({ id, PanelComponent }) => (
            <TabPanel key={id} value={id}>
              <PanelComponent symbol={symbol!} />
            </TabPanel>
          ))}
        </TabContext>
      </PageLayout>
    </>
  );
};

export default TickerPage;
