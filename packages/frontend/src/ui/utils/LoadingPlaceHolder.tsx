import React, { ReactElement } from 'react'

export interface Props {
   data: any[] | undefined
   isLoading: boolean
   children: (data: any[]) => ReactElement
   noDataMessage: string
}

export const LoadingPlaceHolder: React.FunctionComponent<Props> = ({
   isLoading,
   data,
   noDataMessage,
   children,
}: Props) => {
   if (isLoading) {
      return <p>Please wait...</p>
   }

   if (data?.length === 0 || data === undefined) {
      return <p>{noDataMessage}</p>
   }

   return children(data)
}
