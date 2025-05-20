export interface TickerDTO {
  last_price: [number, string]
  market_id: string
  max_bid: [number, string]
  min_ask: [number, string]
  price_variation_24h: number
  price_variation_7d: number
  volume: [number, string]
}

export interface MarketDTO {
  id: string
  name: string
  base_currency: string
  quote_currency: string
  minimum_order_amount: [number, string]
  taker_fee: number
  maker_fee: number
  max_orders_per_minute: number
  maker_discount_percentage: number
  taker_discount_percentage: number
  maker_discount_tiers: Record<string, number>
  taker_discount_tiers: Record<string, number>
}
