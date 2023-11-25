import { Box } from "@mui/material";
import { PuffLoader } from "react-spinners";

export const LoadingBox = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100%"}
    >
      <PuffLoader size={120} />
    </Box>
  );
};
