import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import { useScreenerWithGroups } from "./hooks/useScreenerWithGroups.ts";
import { Box } from "@mui/material";
import { PieChart } from "../../lib/ui/chart/PieChart.tsx";

export const SummaryView = () => {
  const { groupedBySector, groupedByCapitalisation } = useScreenerWithGroups({
    hammerOnly: false,
  });

  return (
    <PageLayout>
      <Box display="flex" gap={2}>
        <Box flexGrow={1}>
          <p>By Sector</p>
          <Box height={"600px"}>
            <PieChart
              data={Object.entries(groupedBySector).map(([key, entries]) => ({
                name: key,
                value: entries.length,
              }))}
            />
          </Box>
        </Box>
        <Box flexGrow={1}>
          <p>By Capitalisation</p>
          <Box height={"600px"}>
            <PieChart
              data={Object.entries(groupedByCapitalisation).map(
                ([key, entries]) => ({
                  name: key,
                  value: entries.length,
                }),
              )}
            />
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
};
