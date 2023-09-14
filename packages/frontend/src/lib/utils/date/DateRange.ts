class DateRange extends Array<string> {
   static fromString(from: Date, to: Date): DateRange {
      const dates: string[] = []

      const start = from

      dates.push(start.toISOString().slice(0, 10))
      while (start <= to) {
         start.setDate(start.getDate() + 1)
         dates.push(start.toISOString().slice(0, 10))
      }

      return dates
   }
}

export default DateRange
