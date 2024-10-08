import { Box, useTheme } from "@mui/material";
import { LoadingBox } from "./LoadingBox.tsx";

export const LoadingPage = () => {
  const theme = useTheme();

  return (
    <Box
      display={"flex"}
      position={"absolute"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      sx={{
        backgroundColor: theme.palette.background.default,
        zIndex: 5000,
      }}
    >
      <LoadingBox />
    </Box>
  );
};
