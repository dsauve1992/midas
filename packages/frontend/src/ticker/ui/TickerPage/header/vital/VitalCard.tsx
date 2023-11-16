import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { statusColorMapper } from "./utils";
import { VitalCardStatus } from "./VitalCardStatus.ts";

export interface Props {
  label: string;
  children: React.ReactNode;
  status?: VitalCardStatus;
  size: "sm" | "md";
}

const VitalCard: React.FunctionComponent<Props> = ({
  children,
  label,
  status = VitalCardStatus.DEFAULT,
  size,
}: Props) => (
  <Card
    sx={{ margin: "10px", backgroundColor: statusColorMapper(status) }}
    raised
  >
    <CardContent>
      <Typography
        sx={{ fontSize: size === "md" ? 15 : 12 }}
        color="text.secondary"
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: size === "md" ? 35 : 20 }}
        component="div"
        textAlign="center"
      >
        {children}
      </Typography>
    </CardContent>
  </Card>
);

export default VitalCard;
