export const formatPrice = (number: number) => Number(number?.toFixed(1)).toLocaleString()

export const formatNumber = (num: number | string): string => {
  if (typeof num === 'string') return num

  if (num >= 1000000) {
    return (num / 1000000)?.toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000)?.toFixed(1) + 'K'
  }
  return num?.toString()
}
