import { useRef } from 'react'

const useDeviceRatio = () => {
   const { current } = useRef<HTMLCanvasElement>()
   if (!current) {
      return 1
   }

   const context: any = current.getContext('2d')

   const { devicePixelRatio } = window

   const backingStoreRatio =
      context.webkitBackingStorePixelRatio ??
      context.mozBackingStorePixelRatio ??
      context.msBackingStorePixelRatio ??
      context.oBackingStorePixelRatio ??
      context.backingStorePixelRatio ??
      1

   return devicePixelRatio / backingStoreRatio
}

export default useDeviceRatio
