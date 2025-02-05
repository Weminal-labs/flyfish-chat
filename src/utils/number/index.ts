/**
 * Use to round a `num` to `dec` th decimal.
 * @param num
 * @param to
 */
function roundTo(num: number, dec: number = 10) {
  return Math.round(num * dec) / dec;
}

/**
 * Use to get a random number from `min` to `max`.
 * @param min
 * @param max
 * @returns
 */
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1));
}

export const NumberUtils = {
  getRandom,
  roundTo,
};

/**
 * Use to round a `num` to `dec` th decimal.
 * @param address
 * @param startLength
 * @param endLength
 * @returns string
 */
export function addressEllipsis(
  address: string,
  startLength = 6,
  endLength = 4,
): string {
  if (!address || typeof address !== "string") return "";

  // Ensure the address is long enough
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}
