import React, { useState } from "react";
import { Box } from "@mui/material";
import { SelectableElement, StockTree } from "./StockTree.tsx";
import { SelectionDetail } from "./SelectionDetail.tsx";
import { useNewScreener } from "../ui/hooks/useNewScreener.ts";

export interface Props {}

export const NewScreenerPage: React.FunctionComponent<Props> = () => {
  const { data, isLoading } = useNewScreener();

  const [selection, setSelection] = useState<SelectableElement>();

  const handleSelectElement = (element: SelectableElement) => {
    setSelection(element);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (data) {
    return (
      <Box display="flex" flexDirection="row" gap={"10px"} width={"100%"}>
        <Box height={"100%"} width={"400px"} overflow="auto">
          <StockTree
            tree={data}
            selection={selection}
            onSelect={handleSelectElement}
          />
        </Box>
        <Box height={"100%"} width={"100%"} overflow="auto">
          {selection && <SelectionDetail selection={selection} />}
        </Box>
      </Box>
    );
  }

  return null;
};

export default NewScreenerPage;
