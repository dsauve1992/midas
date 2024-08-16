import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import HomeIcon from "@mui/icons-material/Home";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../../../search/ui/SearchBar/SearchBar.tsx";
import type { SearchTickerResult } from "backend/src/shared-types/financial-modeling-prep";
import { useAuth0 } from "@auth0/auth0-react";

const MidasMenu = ({ ref }: { ref?: React.Ref<HTMLElement> }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth0();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function onClickResult(stock: SearchTickerResult) {
    navigate(`/ticker/${stock.symbol}`, { state: { stock } });
  }

  async function onLogout() {
    await logout();
  }

  return (
    <Box display="flex" flexBasis="auto" ref={ref}>
      <AppBar position="relative">
        <Toolbar>
          <IconButton onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar onSelect={onClickResult} />
          </Box>
          <Box sx={{ flexGrow: 3 }}>
            <Button variant="text" onClick={() => navigate("/tools")}>
              Tools
            </Button>
            <Button variant="text" onClick={() => navigate("/screener")}>
              Screener
            </Button>
            <Button variant="text" onClick={() => navigate("/watchlist")}>
              Watchlist
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={user?.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={onLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MidasMenu;
