import { Typography } from "@mui/material";
import { TickerCard } from "./TickerCard.tsx";
import {
  IndustryGroupTickerCollection,
  SectorTickerCollection,
} from "../domain/NestedTickerCollection.ts";
import Box from "@mui/material/Box";
import TradingViewSimpleDailyTapeCard from "../../lib/ui/chart/TradingViewSimpleDailyTapeCard.tsx";

export const SectorDetail = (props: { sector: SectorTickerCollection }) => {
  const { sector } = props;

  return (
    <Box padding="20px">
      <Typography variant="h2" marginBottom={"50px"}>
        {sector.name}
      </Typography>
      {sector.index && (
        <Box height={"600px"} marginBottom={"50px"}>
          <TradingViewSimpleDailyTapeCard symbol={sector.index} />
        </Box>
      )}

      {sector.industryGroups.map((group) => (
        <IndustryGroupDetail key={group.name} group={group} />
      ))}
    </Box>
  );
};

const IndustryGroupDetail = (props: {
  group: IndustryGroupTickerCollection;
}) => {
  const { group } = props;

  return (
    <Box padding="20px" marginBottom={"80px"}>
      <Typography variant="h3" marginBottom={"25px"}>
        {group.name}
      </Typography>
      {group.tickers.map((ticker) => (
        <TickerCard ticker={ticker} key={ticker.symbol} />
      ))}
    </Box>
  );
};
