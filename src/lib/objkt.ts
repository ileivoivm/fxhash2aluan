/** Known fxhash FA2 → objkt collection path (pretty URL). */
const OBJKT_PATH_BY_CONTRACT: Record<string, string> = {
  // fx(hash): Genesis — e.g. Chaos Research
  KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE: 'fxhashgenesis',
  // fx(hash) GENTK v2 — e.g. Chaos Memory / Culture / Collage / Turner / AVLab
  KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi: 'fxhash',
}

/**
 * Objkt token page.
 * Prefers slug URLs like https://objkt.com/tokens/fxhashgenesis/269937
 * Falls back to contract address when the FA path is unknown.
 */
export function objktTokenUrl(contract: string, tokenId: string): string {
  const path = OBJKT_PATH_BY_CONTRACT[contract] ?? contract
  return `https://objkt.com/tokens/${path}/${tokenId}`
}
