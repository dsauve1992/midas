import { Box, Button, TextField } from "@mui/material";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { PositionWishFormData } from "../domain/PositionWishFormData.ts";
import SearchBar from "../../search/ui/SearchBar/SearchBar.tsx";
import TradingViewTapeCardWidget from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";

export const PositionManagementPage = () => {
  const [positionWishFormData, setPositionWishFormData] =
    useState<PositionWishFormData>(PositionWishFormData.init());

  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"}>
      <Helmet>
        <title>Position Management - Midas</title>
      </Helmet>

      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        height={"100%"}
        gap={"4px"}
      >
        <Box
          component="form"
          display={"flex"}
          flexDirection="column"
          p={1}
          gap={4}
        >
          <SearchBar
            onSelect={({ symbol, exchangeShortName: exchange }) =>
              setPositionWishFormData(
                positionWishFormData.updateSymbol({ exchange, symbol }),
              )
            }
          />
          {positionWishFormData.symbol && (
            <>
              <TextField
                label="Risk Percentage"
                variant="outlined"
                value={positionWishFormData.riskPercentage}
                onChange={(e) =>
                  setPositionWishFormData(
                    positionWishFormData.updateRiskPercentage(
                      Number.parseFloat(e.target.value),
                    ),
                  )
                }
              />
              <TextField
                label="Portfolio Value"
                type="number"
                variant="outlined"
                value={positionWishFormData.portfolioValue}
                onChange={(e) =>
                  setPositionWishFormData(
                    positionWishFormData.updatePortfolioValue(
                      Number.parseFloat(e.target.value),
                    ),
                  )
                }
              />
              <TextField
                label="Buy Price"
                type="number"
                variant="outlined"
                value={positionWishFormData.buyPrice}
                onChange={(e) =>
                  setPositionWishFormData(
                    positionWishFormData.updateBuyPrice(
                      Number.parseFloat(e.target.value),
                    ),
                  )
                }
              />
              <TextField
                label="Stop Loss Price"
                type="number"
                variant="outlined"
                value={positionWishFormData.stopLoss}
                onChange={(e) =>
                  setPositionWishFormData(
                    positionWishFormData.updateStopLoss(
                      Number.parseFloat(e.target.value),
                    ),
                  )
                }
              />
              <TextField
                label="Nb Shares"
                type="number"
                disabled
                variant="outlined"
                value={positionWishFormData.stopLoss}
              />
              <Button fullWidth variant="contained">
                Save
              </Button>
            </>
          )}
        </Box>
        <Box flex={1} p={1}>
          {positionWishFormData.symbol && (
            <TradingViewTapeCardWidget
              exchange={positionWishFormData.symbol.exchange}
              interval={"W"}
              range={"6m"}
              symbol={positionWishFormData.symbol.symbol}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
