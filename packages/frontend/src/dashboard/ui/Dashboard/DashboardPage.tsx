import { Grid } from "@mui/material";
import { Profile } from "../../../auth/ui/Profile.tsx";
import { EarningsCalendar } from "./EarningsCalendar.tsx";

export const DashboardPage = () => {
  return (
    <Grid container spacing={2}>
      <h1>Welcome</h1>
      <Profile />
      <EarningsCalendar />
    </Grid>
  );
};
