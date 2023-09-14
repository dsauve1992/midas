import { useEffect } from 'react'

export function useKeyPress(targetKey: string, onKeyUp: () => void) {
   // If released key is our target key then set to false
   const upHandler = ({ key }: any) => {
      if (key === targetKey) {
         onKeyUp()
      }
   }
   // Add event listeners
   useEffect(() => {
      window.addEventListener('keyup', upHandler)
      // Remove event listeners on cleanup
      return () => {
         window.removeEventListener('keyup', upHandler)
      }
   }, [onKeyUp])
}
