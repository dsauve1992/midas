import { MouseEventHandler, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { PositionModelDto } from "backend/src/shared-types/position";

export type PositionDetailsDrawerProps = {
  onClose: () => void;
  position: PositionModelDto | undefined;
};

// Position Details Drawer Component
export const PositionDetailDrawer = ({
  onClose,
  position,
}: PositionDetailsDrawerProps) => {
  // State for the actions menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const menuOpen = Boolean(menuAnchorEl);

  // Handle menu open
  const handleMenuClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeletePosition = () => {
    // Implement delete functionality
    console.log("Delete position clicked");
    handleMenuClose();
  };

  // Company logo URL
  const logoUrl = `https://images.financialmodelingprep.com/symbol/${position?.symbol.symbol}.png`;

  return (
    <Drawer
      anchor="right"
      open={!!position}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      {!!position && (
        <>
          {/* Drawer Header */}
          <Box
            sx={{
              bgcolor: "gray",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Position Details
            </Typography>
            <Box>
              {/* Actions Menu Button */}
              <IconButton
                color="inherit"
                size="small"
                onClick={handleMenuClick}
                sx={{ mr: 1 }}
              >
                <MoreVertIcon />
              </IconButton>

              {/* Close Button */}
              <IconButton color="inherit" size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Actions Menu */}
            <Menu
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={handleDeletePosition}
                sx={{ color: "#E53935" }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>

          {/* Company Info Section */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Avatar
              src={logoUrl}
              variant={"square"}
              sx={{
                width: 60,
                height: 60,
                color: "#333",
                objectFit: "scale-down",
                fontWeight: "bold",
                mr: 2,
              }}
            >
              {position.symbol.symbol}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                TODO company name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${position.symbol.exchange}:${position.symbol.symbol}`}
              </Typography>
            </Box>
          </Box>

          {/* Position Details Section */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Position Details
            </Typography>

            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Wished Entry Price"
                  primaryTypographyProps={{
                    color: "text.secondary",
                    variant: "body2",
                  }}
                />
                <Typography variant="body2">
                  ${position.buyPrice.toFixed(2)}
                </Typography>
              </ListItem>

              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Quantity"
                  primaryTypographyProps={{
                    color: "text.secondary",
                    variant: "body2",
                  }}
                />
                <Typography variant="body2">
                  {position.quantity} shares
                </Typography>
              </ListItem>

              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Wished Total Investment"
                  primaryTypographyProps={{
                    color: "text.secondary",
                    variant: "body2",
                  }}
                />
                <Typography variant="body2">
                  ${(position.buyPrice * position.quantity).toFixed(2)}
                </Typography>
              </ListItem>

              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Stop Loss"
                  primaryTypographyProps={{
                    color: "text.secondary",
                    variant: "body2",
                  }}
                />
                <Typography variant="body2">
                  ${position.stopLoss.toFixed(2)}
                </Typography>
              </ListItem>

              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary="Risk Percentage"
                  primaryTypographyProps={{
                    color: "text.secondary",
                    variant: "body2",
                  }}
                />
                <Chip
                  label={`${position.riskPercentage.toFixed(2)}%`}
                  size="small"
                  sx={{
                    bgcolor: "#c8e6c9",
                    color: "#2e7d32",
                    fontWeight: "medium",
                    fontSize: "0.75rem",
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </>
      )}
    </Drawer>
  );
};
