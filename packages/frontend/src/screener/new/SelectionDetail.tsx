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

      {sector.children().map((entry) => (
        <IndustryGroupDetail key={entry.name} group={entry} />
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
      {group.listEntities().map((entry) => (
        <TickerCard entry={entry} />
      ))}
    </Box>
  );
};
