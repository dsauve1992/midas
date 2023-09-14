
import Color from 'color'
import { v4 as uuidv4 } from 'uuid';

function applyUniqueIdToAllRows<T>(rows: T[]): ({ id: string } & T)[] {
   return rows.map((row) => ({ id: uuidv4(), ...row }))
}

export function transformArrayToPercentageValue(array: number[]) {
   const sortedValues = [...array].sort((a, b) => a - b)

   const valueBasedIndex = array.map((value) => sortedValues.indexOf(value))

   return valueBasedIndex.map((value) =>
      parseFloat(((value / (valueBasedIndex.length - 1)) * 100).toFixed(1))
   )
}

export function mapArrayToHeatColor(array: number[]): Map<number, Color> {
   const percValues = transformArrayToPercentageValue(array)

   const colors = percValues
      .map((value) => (value * (359 - 255)) / 100 + 255)
      .map((value) => Color.hsl(value, 100, 50))

   const tupleValueColor: [number, Color][] = array.map((value, index) => [
      value,
      colors[index],
   ])

   return new Map(tupleValueColor)
}

export default applyUniqueIdToAllRows
