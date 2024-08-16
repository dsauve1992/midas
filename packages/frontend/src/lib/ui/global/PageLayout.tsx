import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <Box flexGrow={1} height={"100%"} padding={"20px"}>
      {children}
    </Box>
  );
};
