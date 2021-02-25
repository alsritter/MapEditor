import BasePos from "./BasePos";

/**
 * 出生和结束的位置
 */
export default class StartAndEndPos {
  start: BasePos;
  end: BasePos;
  constructor(start: BasePos, end: BasePos) {
    this.start = start;
    this.end = end;
  }
}
