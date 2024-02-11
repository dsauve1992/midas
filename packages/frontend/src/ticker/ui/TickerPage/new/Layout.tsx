import Box from "@mui/material/Box";
import React from "react";

export type Props = {
  mainSection: React.ReactNode;
  leftPanel: React.ReactNode;
  bottomPanel: React.ReactNode;
};

export const Layout = ({ mainSection, leftPanel, bottomPanel }: Props) => {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"scroll"}
      display={"flex"}
      flexDirection={"row"}
      sx={{ backgroundColor: "red" }}
    >
      <Box width={"20%"} height={"100%"} sx={{ backgroundColor: "blue" }}>
        {leftPanel}
      </Box>
      <Box
        width={"80%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ backgroundColor: "green" }}
      >
        <Box
          width={"100%"}
          height={"80%"}
          display={"flex"}
          flexDirection={"column"}
          sx={{ backgroundColor: "yellow" }}
        >
          {mainSection}
        </Box>
        <Box
          width={"100%"}
          height={"20%"}
          display={"flex"}
          flexDirection={"column"}
          sx={{ backgroundColor: "purple" }}
        >
          {bottomPanel}
        </Box>
      </Box>
    </Box>
  );
};
