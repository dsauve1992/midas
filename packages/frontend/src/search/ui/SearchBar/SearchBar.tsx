import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { alpha, styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { SearchResults } from './SearchResults'
import { useSearchBar } from './useSearchBar'
import { SearchResult } from '../../../api/financialModelingPrep/types'

const Search = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginRight: theme.spacing(2),
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
   },
}))

const Bar = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   width: '100%',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
         width: '20ch',
      },
   },
}))

export interface Props {
   onSelect: (value: SearchResult) => void
}

const inputProps = { 'aria-label': 'search' }
const SearchBar: React.FunctionComponent<Props> = ({ onSelect }: Props) => {
   const { searchQuery, onKeyPress, setSearchQuery, results, selectAndReset } =
      useSearchBar({ onSelect })

   return (
      <Search>
         <Bar>
            <SearchIconWrapper>
               <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
               placeholder="Search…"
               value={searchQuery}
               onKeyPress={onKeyPress}
               onChange={(event) =>
                  setSearchQuery(event.target.value.toUpperCase())
               }
               inputProps={inputProps}
            />
            <SearchResults results={results} onSelect={selectAndReset} />
         </Bar>
      </Search>
   )
}

export default SearchBar