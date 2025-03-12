import { Grid, Typography } from "@mui/material";
import { PositionWishCard } from "../component/PositionWishCard.tsx";
import { PositionModelDto } from "backend/src/shared-types/position";

type PositionCardsViewProps = {
  positions: PositionModelDto[] | undefined;
  onSelectPosition: (position: PositionModelDto) => void;
};

export const PositionCardsView = ({
  positions,
  onSelectPosition,
}: PositionCardsViewProps) => {
  return (
    <Grid container spacing={2}>
      {positions && positions?.length > 0 ? (
        positions?.map((position) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={position.id}>
            <PositionWishCard
              position={position}
              onClick={() => onSelectPosition(position)}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            No position wishes found. Create one to get started.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
