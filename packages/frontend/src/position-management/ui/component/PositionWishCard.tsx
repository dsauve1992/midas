import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import WarningIcon from "@mui/icons-material/Warning";
import { PositionModelDto } from "backend/src/shared-types/position";

export type Props = {
  position: PositionModelDto;
};

export const PositionWishCard = ({ position }: Props) => {
  const classes = useStyles();

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Calculate potential loss based on stop loss
  const potentialLoss =
    (position.buyPrice - position.stopLoss) * position.quantity;

  // Determine risk level styling
  const getRiskChipClass = () => {
    if (position.riskPercentage * 100 < 1) return classes.lowRisk;
    if (position.riskPercentage * 100 < 2) return classes.mediumRisk;
    return classes.highRisk;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Company logo URL
  const logoUrl = `https://images.financialmodelingprep.com/symbol/${position.symbol.symbol}.png`;

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Grid container spacing={2}>
          {/* Symbol and Logo */}
          <Grid item xs={7} sm={8}>
            <Box display="flex" alignItems="center">
              <Avatar
                src={logoUrl}
                alt={position.symbol.symbol}
                className={classes.stockImage}
              >
                {position.symbol.symbol.charAt(0)}
              </Avatar>
              <Box ml={2}>
                <Typography className={classes.symbolText} variant="h6">
                  {position.symbol.symbol}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {position.symbol.exchange || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Risk Percentage */}
          <Grid
            item
            xs={5}
            sm={4}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <Chip
              icon={<WarningIcon fontSize="small" color={"warning"} />}
              label={`${(position.riskPercentage * 100).toFixed(2)}% Risk`}
              className={`${classes.riskChip} ${getRiskChipClass()}`}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Trading Information */}
        <Box mt={2}>
          <Box className={classes.dataRow}>
            <Typography className={classes.dataLabel}>Quantity:</Typography>
            <Typography className={classes.dataValue}>
              {position.quantity} shares
            </Typography>
          </Box>

          <Box className={classes.dataRow}>
            <Typography className={classes.dataLabel}>Buy Price:</Typography>
            <Typography className={classes.dataValue}>
              {formatCurrency(position.buyPrice)}
            </Typography>
          </Box>

          <Box className={classes.dataRow}>
            <Typography className={classes.dataLabel}>Stop Loss:</Typography>
            <Typography className={classes.dataValue}>
              {formatCurrency(position.stopLoss)}
            </Typography>
          </Box>

          <Box className={classes.dataRow}>
            <Typography className={classes.dataLabel}>
              Potential Loss:
            </Typography>
            <Typography className={classes.dataValue} color="error">
              {formatCurrency(potentialLoss)}
            </Typography>
          </Box>
        </Box>

        {/* Timestamp */}
        <Typography className={classes.timestamp}>
          Created: {formatDate(position.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Create styles using makeStyles
const useStyles = makeStyles(() => ({
  card: {
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
    margin: "8px 0",
  },
  stockImage: {
    width: 40,
    objectFit: "contain",
  },
  symbolText: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  riskChip: {
    fontWeight: "bold",
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dataLabel: {
    color: "text.secondary",
    fontSize: "0.9rem",
  },
  dataValue: {
    fontWeight: "medium",
    fontSize: "0.9rem",
  },
  lowRisk: {
    backgroundColor: "#c8e6c9", // Light green
    color: "#2e7d32",
  },
  mediumRisk: {
    backgroundColor: "#fff9c4", // Light yellow
    color: "#f9a825",
  },
  highRisk: {
    backgroundColor: "#ffcdd2", // Light red
    color: "#c62828",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "text.secondary",
    marginTop: 8,
  },
}));
