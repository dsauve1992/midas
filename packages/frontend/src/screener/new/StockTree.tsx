import {
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  NestedTickerCollection,
  SectorTickerCollection,
} from "../domain/NestedTickerCollection.ts";

export type SelectableElement = NestedTickerCollection;

export type StockTreeProps = {
  tree: SectorTickerCollection[];
  selection?: SelectableElement;
  onSelect: (element: SelectableElement) => void;
};

export const StockTree = (props: StockTreeProps) => {
  const { tree, selection, onSelect } = props;

  return (
    <List>
      {tree.map((sector) => (
        <SectorNestedList
          key={sector.name}
          sector={sector}
          selection={selection}
          onSelect={onSelect}
        />
      ))}
    </List>
  );
};

export const SectorNestedList = (props: {
  sector: SectorTickerCollection;
  selection?: SelectableElement;
  onSelect: (element: SelectableElement) => void;
}) => {
  const { sector, selection, onSelect } = props;

  const [open, setOpen] = useState<boolean>();

  const ToggleIcon = open ? ExpandLess : ExpandMore;

  return (
    <div key={sector.name}>
      <Box display="flex" flexDirection="row">
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
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <ToggleIcon />
          </IconButton>
        </ListItemButton>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ pl: 2 }}>
          {sector.children().map((group) => (
            <ListItemButton
              key={group.name}
              onClick={() => onSelect(group)}
              selected={group == selection}
            >
              <ListItemText
                primary={
                  <span>
                    {group.name} <Chip label={group.count()} />
                  </span>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
};
