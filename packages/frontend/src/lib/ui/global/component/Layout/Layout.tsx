import { Container } from "@mui/material";
import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import MidasMenu from "../Menu/MidasMenu.tsx";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../../../../../dashboard/ui/Dashboard/DashboardPage.tsx";
import TickerPage from "../../../../../ticker/ui/TickerPage/TickerPage.tsx";
import { ToolsPage } from "../../../../../tools/ToolsPage.tsx";
import { WatchListsPage } from "../../../../../watchlist/ui/WatchListsPage.tsx";
import { useElementSize } from "usehooks-ts";
import ScreenerPage from "../../../../../screener/ui/ScreenerPage.tsx";
import { DummyPage } from "../../../../../dummy/DummyPage.tsx";
import { PositionManagementPage } from "../../../../../position-management/ui/PositionManagementPage.tsx";

const Layout: React.FunctionComponent = () => {
  const [squareRef, { height }] = useElementSize();

  const mainSectionHeight = useMemo(
    () => `calc(100vh - ${height}px)`,
    [height],
  );

  return (
    <Container disableGutters maxWidth={false}>
      <Box
        display={"flex"}
        height={"100vh"}
        maxHeight={"100vh"}
        flexDirection={"column"}
      >
        <div ref={squareRef}>
          <MidasMenu />
        </div>

        <Box display={"flex"} height={mainSectionHeight}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ticker/:id/*" element={<TickerPage />} />
            <Route path="/screener" element={<ScreenerPage />} />
            <Route
              path="/position-management"
              element={<PositionManagementPage />}
            />
            <Route path="/test" element={<DummyPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/watchlist" element={<WatchListsPage />} />
          </Routes>
        </Box>
      </Box>
    </Container>
  );
};

export default Layout;
