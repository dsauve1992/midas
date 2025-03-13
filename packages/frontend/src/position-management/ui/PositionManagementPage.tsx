import { Box, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { useGetPositions } from "../hooks/useGetPositions.ts";
import { PositionCardsView } from "./view/PositionCardsView.tsx";
import { CreatePositionForm } from "./component/CreatePositionForm.tsx";
import { useState } from "react";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import Drawer from "@mui/material/Drawer";
import { PositionModelDto } from "backend/src/shared-types/position";
import { PositionDetailDrawer } from "./component/PositionDetailDrawer.tsx";

export const PositionManagementPage = () => {
  const { data } = useGetPositions();
  const [openCreatePositionFormDrawer, setOpenCreatePositionFormDrawer] =
    useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionModelDto>();

  const handleCloseCreatePositionFormDrawer = () => {
    setOpenCreatePositionFormDrawer(!openCreatePositionFormDrawer);
  };

  const handleClosePositionDetailDrawer = () => {
    setSelectedPosition(undefined);
  };

  const handleSelectPosition = (position: PositionModelDto) => {
    setSelectedPosition(position);
  };

  return (
    <>
      <Helmet>
        <title>Position Management - Midas</title>
      </Helmet>
      <PageLayout>
        <Button
          variant="contained"
          onClick={() => setOpenCreatePositionFormDrawer(true)}
        >
          Create New Position
        </Button>

        <PositionCardsView
          positions={data}
          onSelectPosition={handleSelectPosition}
        />

        <Drawer
          test-id={"create-position-form-drawer"}
          anchor={"right"}
          open={openCreatePositionFormDrawer}
          onClose={handleCloseCreatePositionFormDrawer}
        >
          <Box minWidth={1600} height={"100%"}>
            <CreatePositionForm
              onSuccess={handleCloseCreatePositionFormDrawer}
            />
          </Box>
        </Drawer>

        <PositionDetailDrawer
          position={selectedPosition}
          onClose={handleClosePositionDetailDrawer}
        />
      </PageLayout>
    </>
  );
};
