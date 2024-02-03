import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { StockTree } from "./StockTree.tsx";
import { useScreener } from "../ui/hooks/useScreener.ts";
import { SectorTickerCollection } from "../domain/NestedTickerCollection.ts";
import { SectorDetail } from "./SelectionDetail.tsx";
import { Helmet } from "react-helmet";

export interface Props {}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
  const { data, isLoading } = useScreener();

  const [selection, setSelection] = useState<SectorTickerCollection>();

  useEffect(() => {
    if (data?.length) {
      setSelection(data?.[0]);
    }
  }, [data]);

  const handleSelectElement = (element: SectorTickerCollection) => {
    setSelection(element);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (data) {
    return (
      <>
        <Helmet>
          <title>Screener - Midas</title>
        </Helmet>

        <Box display="flex" flexDirection="row" gap={"10px"} width={"100%"}>
          <Box height={"100%"} width={"400px"} overflow="auto">
            <StockTree
              tree={data}
              selection={selection}
              onSelect={handleSelectElement}
            />
          </Box>
          <Box height={"100%"} width={"100%"} overflow="auto">
            {selection && (
              <SectorDetail sector={selection} key={selection.name} />
            )}
          </Box>
        </Box>
      </>
    );
  }

  return null;
};

export default ScreenerPage;
