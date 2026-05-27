import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // Determine if the currency should have zero decimals (like COP)
  const isZeroDecimal = currency_code?.toLowerCase() === "cop"
  const resolvedMinFractionDigits = minimumFractionDigits !== undefined ? minimumFractionDigits : (isZeroDecimal ? 0 : undefined)
  const resolvedMaxFractionDigits = maximumFractionDigits !== undefined ? maximumFractionDigits : (isZeroDecimal ? 0 : undefined)

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits: resolvedMinFractionDigits,
        maximumFractionDigits: resolvedMaxFractionDigits,
      }).format(amount)
    : amount.toString()
}
