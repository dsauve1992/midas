import React, { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { Box } from "@mui/material";

interface LoadOnViewportEnter {
  render: () => React.JSX.Element;
}

export const LoadOnViewportEnter = ({ render }: LoadOnViewportEnter) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(ref);

  return (
    <Box ref={ref} height={"126px"}>
      {!!enterCount && render()}
    </Box>
  );
};
