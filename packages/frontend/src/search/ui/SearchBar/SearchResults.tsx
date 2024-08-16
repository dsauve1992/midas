import { styled } from "@mui/material/styles";
import { Chip, List, ListItem, ListItemText } from "@mui/material";
import type { SearchTickerResult } from "backend/src/shared-types/financial-modeling-prep";

const Root = styled("div")(({ theme }) => ({
  position: "absolute",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[800],
  zIndex: 999,
  left: 0,
  right: 0,
}));

interface Props {
  results?: SearchTickerResult[];
  onSelect: (result: SearchTickerResult) => void;
}

export const SearchResults = ({ results, onSelect }: Props) => {
  return results?.length ? (
    <Root>
      <List>
        {results.map((entry) => (
          <ListItem
            key={entry.symbol}
            divider
            onClick={() => onSelect(entry)}
            style={{ cursor: "pointer" }}
          >
            <ListItemText
              primary={
                <>
                  {entry.symbol}
                  <Chip
                    size={"small"}
                    label={entry.stockExchange}
                    style={{ marginLeft: "10px" }}
                    color="primary"
                  />
                </>
              }
              secondary={entry.name}
            />
          </ListItem>
        ))}
      </List>
    </Root>
  ) : null;
};
