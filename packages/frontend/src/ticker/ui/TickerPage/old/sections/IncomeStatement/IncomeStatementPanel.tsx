import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import FinancialPeriod from "../../../../../../lib/FinancialPeriod.ts";
import IncomeStatementArea from "./IncomeStatementArea.tsx";

export interface Props {
  symbol: string;
}

const IncomeStatementPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const [period, setPeriod] = useState<FinancialPeriod>(
    FinancialPeriod.QUARTER,
  );

  return (
    <>
      <ToggleButtonGroup
        style={{ marginBottom: "15px" }}
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
      >
        <ToggleButton value={FinancialPeriod.QUARTER}>Quarter</ToggleButton>
        <ToggleButton value={FinancialPeriod.ANNUAL}>Annual</ToggleButton>
      </ToggleButtonGroup>
      <IncomeStatementArea symbol={symbol} frequency={period} />
    </>
  );
};

export default IncomeStatementPanel;
