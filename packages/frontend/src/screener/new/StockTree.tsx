import { Chip, List, ListItemButton, ListItemText } from "@mui/material";
import { SectorTickerCollection } from "../domain/NestedTickerCollection.ts";

export type StockTreeProps = {
  tree: SectorTickerCollection[];
  selection?: SectorTickerCollection;
  onSelect: (element: SectorTickerCollection) => void;
};

export const StockTree = (props: StockTreeProps) => {
  const { tree, selection, onSelect } = props;

  return (
    <List>
      {tree.map((sector) => (
        <ListItemButton
          onClick={() => onSelect(sector)}
          selected={sector == selection}
        >
          <ListItemText
            primary={
              <span>
                {sector.name} <Chip label={sector.count()} />
              </span>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
};
