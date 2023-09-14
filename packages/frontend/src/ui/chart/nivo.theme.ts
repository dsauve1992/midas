import { Theme } from '@nivo/core'

export const NIVO_THEME: Theme = {
   background: '#000000',
   textColor: '#ffffff',
   fontSize: 11,
   axis: {
      domain: {
         line: {
            stroke: '#fcfcfc',
            strokeWidth: 1,
         },
      },
      legend: {
         text: {
            fontSize: 12,
            fill: '#ffffff',
         },
      },
      ticks: {
         line: {
            stroke: '#ffffff',
            strokeWidth: 1,
         },
         text: {
            fontSize: 11,
            fill: '#ffffff',
         },
      },
   },
   grid: {
      line: {
         stroke: '#2d2d2d',
         strokeWidth: 1,
      },
   },
   legends: {
      text: {
         fontSize: 11,
         fill: '#ffffff',
      },
   },
   annotations: {
      text: {
         fontSize: 13,
         fill: '#ffffff',
         outlineWidth: 2,
         outlineColor: '#363636',
      },
      link: {
         stroke: '#000000',
         strokeWidth: 1,
         outlineWidth: 2,
         outlineColor: '#ffffff',
      },
      outline: {
         stroke: '#000000',
         strokeWidth: 2,
         outlineWidth: 2,
         outlineColor: '#ffffff',
      },
      symbol: {
         fill: '#000000',
         outlineWidth: 2,
         outlineColor: '#ffffff',
      },
   },
   tooltip: {
      container: {
         background: '#000000',
         color: '#e0e0e0',
         fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
   },
}
