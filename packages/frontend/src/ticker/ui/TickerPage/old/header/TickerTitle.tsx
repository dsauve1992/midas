import React from "react";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import DescriptionModal from "./DescriptionModal.tsx";
import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";
import { WatchlistToggleButton } from "../../../../../watchlist/ui/WatchlistToggleButton.tsx";

export interface Props {
  profile: StockGeneralInformationResponseDto;
}

const TickerTitle: React.FunctionComponent<Props> = ({ profile }: Props) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Avatar
        src={profile.image}
        variant="square"
        sx={{ width: 80, height: 80 }}
        style={{ marginRight: "20px" }}
      />
      <div>
        <Typography variant="h4">
          {profile.companyName} ({profile.symbol}){" "}
          <WatchlistToggleButton symbol={profile.symbol} />
        </Typography>
        <DescriptionModal description={profile.description} />
        <IconButton
          aria-label={"yahoo"}
          href={`https://finance.yahoo.com/chart/${profile.symbol}`}
        >
          <CandlestickChartIcon />
        </IconButton>
      </div>
    </Box>
  );
};

export default TickerTitle;
