import { Box, Button, Drawer, Grid } from "@mui/material";
import { StandaloneAnnualEpsHistory } from "../../ticker/ui/TickerPage/new/StandaloneAnnualEpsHistory.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/old/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/old/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/old/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { StandaloneInstitutionalOwnershipHistoryByQuarter } from "../../ticker/ui/TickerPage/old/sections/InstitutionalHolders/StandaloneInstitutionalOwnershipHistoryByQuarter.tsx";
import { useState } from "react";

type TicketDetailButtonProps = {
  symbol: string;
};

export const TicketDetailButton = ({ symbol }: TicketDetailButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button size="small" variant="contained" onClick={() => setOpen(true)}>
        Detail
      </Button>
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <TickerDetailPanel symbol={symbol} />
      </Drawer>
    </>
  );
};

const TickerDetailPanel = (props: { symbol: string }) => {
  const { symbol } = props;

  return (
    <Box sx={{ width: 1200 }} role="presentation" padding={"20px"}>
      <Grid container spacing={5}>
        <Grid item xs={12} height={"33vh"}>
          <StandaloneAnnualEpsHistory symbol={symbol} position={"vertical"} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneEpsChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneRevenueChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneEarningSurprisesChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneInstitutionalOwnershipHistoryByQuarter symbol={symbol} />
        </Grid>
      </Grid>
    </Box>
  );
};
