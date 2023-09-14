import { ReactElement } from 'react'

export interface Props<T> {
   data: T[] | undefined
   isLoading: boolean
   children: (data: T[]) => ReactElement
   noDataMessage: string
}

export const LoadingPlaceHolder = <T,>({
   isLoading,
   data,
   noDataMessage,
   children,
}: Props<T>) => {
   if (isLoading) {
      return <p>Please wait...</p>
   }

   if (data?.length === 0 || data === undefined) {
      return <p>{noDataMessage}</p>
   }

   return children(data)
}
