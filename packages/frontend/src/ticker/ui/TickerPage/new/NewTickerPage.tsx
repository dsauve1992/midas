import { useParams } from "react-router-dom";
import { Layout } from "./Layout.tsx";
import TradingViewTapeCard from "../../../../lib/ui/chart/TradingViewTapeCard.tsx";
import Box from "@mui/material/Box";
import { useCompanyGeneralInformation } from "../../hooks/useCompanyGeneralInformation.ts";
import { Avatar, Typography } from "@mui/material";
import { AnnualEpsHistory } from "./AnnualEpsHistory.tsx";
import { useAnnualIncomeStatementWithEstimates } from "../../hooks/useIncomeStatement.ts";
import { useMemo } from "react";

export const NewTickerPage = () => {
  const { id: symbol } = useParams<{ id: string }>();

  const { data } = useCompanyGeneralInformation(symbol!);
  const { data: history } = useAnnualIncomeStatementWithEstimates(symbol!);

  const mem = useMemo(() => {
    return (history || []).map(({ period, earnings, estimate }) => {
      return {
        year: +period,
        value: earnings!.current!,
        growth: earnings!.growth!,
        estimate: estimate,
      };
    });
  }, [history]);

  return (
    <Layout
      mainSection={
        <TradingViewTapeCard
          symbol={`${symbol}`}
          withDateRanges={true}
          interval={"D"}
          range={"3m"}
          hideTopToolbar
        />
      }
      leftPanel={
        <Box>
          <Box display="flex" flexDirection="row">
            <Avatar
              src={data?.image}
              variant="square"
              sx={{ width: 20, height: 20 }}
              style={{ marginRight: "20px" }}
            />
            <Typography>{data?.companyName}</Typography>
          </Box>
          <Box width={"100%"} height={"400px"}>
            <AnnualEpsHistory history={mem} />
          </Box>
        </Box>
      }
      bottomPanel={<></>}
    />
  );
};
