
/**
 * 只记录 X 和 Y 但不去管这个 xy的具体含义
 */
export default class BasePos {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}