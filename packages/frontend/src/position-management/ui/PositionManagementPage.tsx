import { Box, Button, TextField } from "@mui/material";
import { Helmet } from "react-helmet";
import SearchBar from "../../search/ui/SearchBar/SearchBar.tsx";
import TradingViewTapeCardWidget from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { useCreatePositionWish } from "../hooks/useCreatePositionWish.ts";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { SymbolWithExchange } from "../../ticker/domain/SymbolWithExchange.ts";

export type PositionWishFormData = {
  symbolWithExchange: SymbolWithExchange | null;
  portfolioValue: number;
  buyPrice: number;
  stopLoss: number;
  riskPercentage: number;
};

const DEFAULT_RISK_PERCENTAGE = 0.5;

export const PositionManagementPage = () => {
  const { handleSubmit, watch, control, formState } =
    useForm<PositionWishFormData>({
      defaultValues: {
        symbolWithExchange: null,
        riskPercentage: DEFAULT_RISK_PERCENTAGE,
      },
    });

  const { create, processing } = useCreatePositionWish({
    onSuccess: () => toast.success(`successfully created position wish`),
    onError: () => toast.error("Ouf!"),
  });

  const submitForm = (data: PositionWishFormData) => {
    create({
      request: {
        symbol: `${data.symbolWithExchange!.symbol}:${
          data.symbolWithExchange!.exchange
        }`,
        nbShares: computeNbShares(
          data.portfolioValue,
          data.buyPrice,
          data.riskPercentage,
          data.stopLoss,
        ),
        buyPrice: data.buyPrice,
        stopLoss: data.stopLoss,
        riskPercentage: data.riskPercentage,
      },
    });
  };

  const selectedSymbolWithExchange = watch("symbolWithExchange");

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
          p={2}
          gap={4}
        >
          <Controller
            name="symbolWithExchange"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SearchBar
                onSelect={({ symbol, exchangeShortName: exchange }) =>
                  field.onChange({ symbol, exchange })
                }
              />
            )}
          />

          {selectedSymbolWithExchange && (
            <>
              <Controller
                name="riskPercentage"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Risk Percentage"
                    variant="outlined"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                )}
              />

              <Controller
                name="portfolioValue"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Portfolio Value"
                    type="number"
                    variant="outlined"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                )}
              />

              <Controller
                name="buyPrice"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Buy Price"
                    type="number"
                    variant="outlined"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                )}
              />

              <Controller
                name="stopLoss"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Stop Loss Price"
                    type="number"
                    variant="outlined"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                )}
              />

              <TextField
                label="Nb Shares"
                type="number"
                disabled
                variant="outlined"
                value={computeNbShares(
                  watch("portfolioValue"),
                  watch("buyPrice"),
                  watch("riskPercentage"),
                  watch("stopLoss"),
                )}
              />

              <Button
                fullWidth
                disabled={processing || !formState.isValid}
                variant="contained"
                onClick={handleSubmit(submitForm)}
              >
                Save
              </Button>
            </>
          )}
        </Box>
        <Box flex={1} p={1}>
          {selectedSymbolWithExchange && (
            <TradingViewTapeCardWidget
              exchange={selectedSymbolWithExchange.exchange}
              interval={"W"}
              range={"12m"}
              symbol={selectedSymbolWithExchange.symbol}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

function computeNbShares(
  portfolioValue: number,
  buyPrice: number,
  riskPercentage: number,
  stopLoss: number,
) {
  return Math.floor(
    (portfolioValue * (riskPercentage / 100)) / (buyPrice - stopLoss),
  );
}
