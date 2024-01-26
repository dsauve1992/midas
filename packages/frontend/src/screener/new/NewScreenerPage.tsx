import React, { useState } from "react";
import { Box } from "@mui/material";
import { StockTree } from "./StockTree.tsx";
import { useNewScreener } from "../ui/hooks/useNewScreener.ts";
import { SectorTickerCollection } from "../domain/NestedTickerCollection.ts";
import { SectorDetail } from "./SelectionDetail.tsx";

export interface Props {}

export const NewScreenerPage: React.FunctionComponent<Props> = () => {
  const { data, isLoading } = useNewScreener();

  const [selection, setSelection] = useState<SectorTickerCollection>();

  const handleSelectElement = (element: SectorTickerCollection) => {
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
          {selection && <SectorDetail sector={selection} />}
        </Box>
      </Box>
    );
  }

  return null;
};

export default NewScreenerPage;
