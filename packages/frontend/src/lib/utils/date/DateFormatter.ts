import moment from 'moment'

class DateFormatter {
    
   static formatDateDD_MM_YYYY(timestamp: number): string {
      return moment(timestamp).format('DD/MM/YYYY')
   }

    
   static formatDateYYYY_MM_DD(timestamp: number): string {
      return moment(timestamp).format('YYYY-MM-DD')
   }
}

export default DateFormatter
