import React, { useCallback, useState } from 'react'
import { useDebounce } from '../../../ui/utils/hooks/useDebounce'
import { useSearch } from './useSearch'

type useSearchBarProps<T> = {
   onSelect: (value: T) => void
}

export const useSearchBar = <T>({ onSelect }: useSearchBarProps<T>) => {
   const [searchQuery, setSearchQuery] = useState<string>('')
   const debouncedValue = useDebounce<string>(searchQuery, 500)
   const { data: results } = useSearch(debouncedValue)

   const selectAndReset = useCallback(
      (result: T) => {
         setSearchQuery('')
         onSelect(result)
      },
      [onSelect, setSearchQuery]
   )

   const onKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
         if (e.code === 'Enter') {
            if (results) {
               selectAndReset(results[0] as T)
            }
         }
      },
      [searchQuery, selectAndReset]
   )

   return {
      searchQuery,
      setSearchQuery,
      selectAndReset,
      onKeyPress,
      results,
   }
}
