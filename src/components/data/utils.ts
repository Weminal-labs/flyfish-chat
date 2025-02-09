// Import utils
import { NumberUtils } from "src/utils/number";

export class DataUIUtils {
  /**
   * Use to get random color for data card.
   * @returns
   */
  static getColorForDataCard() {
    const MAX = 237,
      MIN = 102;
    const red = NumberUtils.getRandom(MIN, MAX);
    const green = NumberUtils.getRandom(MIN, MAX);
    const blue = NumberUtils.getRandom(MIN, MAX);

    return [red, green, blue];
  }
}
