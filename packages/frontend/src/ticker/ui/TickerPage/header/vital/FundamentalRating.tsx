import VitalCard from './VitalCard'
import {VitalCardStatus} from "./VitalCardStatus.ts";
import {useQuery} from "react-query";
import axios from "axios";
import {isNumber} from "lodash";

export type FundamentalRatingProps = {
    symbol: string
    size?: 'sm' | 'md'
}

export const FundamentalRating = ({
                                          symbol,
                                          size = 'sm',
                                      }: FundamentalRatingProps) => {
    const { data: rating } = useQuery(
        ['rating', symbol],
        async () => (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rating/${symbol}`)).data
    )

    return (
        <VitalCard
            label="Fundamental Rating"
    size={size}
    status={
    (rating || 0) > 65
        ? VitalCardStatus.SAFE
        : VitalCardStatus.WARNING
}
>
    {isNumber(rating)? rating : '-'}
    </VitalCard>
)
}
