import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "../../../search/ui/SearchBar/SearchBar.tsx";
import TradingViewTapeCardWidget from "../../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { SymbolWithExchange } from "../../../ticker/domain/SymbolWithExchange.ts";
import { useCreatePositionWish } from "../../hooks/useCreatePositionWish.ts";
import { toast } from "react-toastify";

export type PositionWishFormData = {
  symbolWithExchange: SymbolWithExchange | null;
  portfolioValue: number;
  entryPrice: number;
  stopLoss: number;
  riskPercentage: number;
};

const DEFAULT_RISK_PERCENTAGE = 0.5;

export type Props = {
  onSuccess: () => void;
};

export const CreatePositionForm = ({ onSuccess }: Props) => {
  const { handleSubmit, watch, control, formState } =
    useForm<PositionWishFormData>({
      defaultValues: {
        symbolWithExchange: null,
        riskPercentage: DEFAULT_RISK_PERCENTAGE,
      },
    });

  const { create, processing } = useCreatePositionWish({
    onSuccess: () => {
      toast.success(`successfully created position wish`);
      onSuccess?.();
    },
    onError: () => toast.error("Ouf!"),
  });

  const submitForm = (data: PositionWishFormData) => {
    create({
      request: {
        symbol: `${data.symbolWithExchange!.exchange}:${
          data.symbolWithExchange!.symbol
        }`,
        nbShares: computeNbShares(
          data.portfolioValue,
          data.entryPrice,
          data.riskPercentage,
          data.stopLoss,
        ),
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss,
        riskPercentage: data.riskPercentage,
      },
    });
  };

  const selectedSymbolWithExchange = watch("symbolWithExchange");

  return (
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
              name="entryPrice"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  label="Entry Price"
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
                watch("entryPrice"),
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
  );
};

function computeNbShares(
  portfolioValue: number,
  entryPrice: number,
  riskPercentage: number,
  stopLoss: number,
) {
  return Math.floor(
    (portfolioValue * (riskPercentage / 100)) / (entryPrice - stopLoss),
  );
}
