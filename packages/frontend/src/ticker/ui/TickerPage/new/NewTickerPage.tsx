import { useParams } from "react-router-dom";
import { Layout } from "./Layout.tsx";
import TradingViewTapeCard from "../../../../lib/ui/chart/TradingViewTapeCard.tsx";
import Box from "@mui/material/Box";
import { useCompanyGeneralInformation } from "../../hooks/useCompanyGeneralInformation.ts";
import { Avatar, Typography } from "@mui/material";
import { AnnualEpsHistory } from "./AnnualEpsHistory.tsx";

export const NewTickerPage = () => {
  const { id: symbol } = useParams<{ id: string }>();

  const { data } = useCompanyGeneralInformation(symbol!);

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
          <Box width={"100%"} height={"200px"}>
            <AnnualEpsHistory
              history={[
                {
                  year: 2023,
                  value: 1.34,
                  growth: 40,
                  estimate: false,
                },
                {
                  year: 2024,
                  value: 2.05,
                  growth: 40,
                  estimate: false,
                },
                {
                  year: 2025,
                  value: 2.64,
                  growth: 20,
                  estimate: false,
                },
                {
                  year: 2026,
                  value: 5.34,
                  growth: 400,
                  estimate: true,
                },
              ].reverse()}
            />
          </Box>
        </Box>
      }
      bottomPanel={<></>}
    />
  );
};
