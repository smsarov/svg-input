import type { Point } from "./Point";
import { addPoints, multByNumber, dist } from "./Point";

interface CubicBezierI {
  getPointAt: (t: number) => Point;
  length: number;
}
/**
 * 
 * builds the cubic bézier curve based on 4 `controls`
 *
 * @param  controls - the array of 4 points upon which to build the curve
 */
function CubicBezier(controls: Point[]): CubicBezierI {
  if (controls.length !== 4)
    throw new RangeError(
      "Exactly 4 points required to construct a Bézier Curve"
    );

  const [p1, p2, p3, p4] = controls;
  /**
   *
   * @param {number} t - parameter of a curve, 0 <= t <= 1
   * @returns {Point} the point with the corresponding parameter
   */
  function getPointAt(t: number): Point {
    const q1 = multByNumber(p1, (1 - t) ** 3);
    const q2 = multByNumber(p2, 3 * t * (1 - t) ** 2);
    const q3 = multByNumber(p3, 3 * t ** 2 * (1 - t));
    const q4 = multByNumber(p4, t ** 3);

    return addPoints([q1, q2, q3, q4]);
  }

  let length = 0;
  let prevPoint = getPointAt(0);
  for (let t = 0; t <= 1; t += 0.01) {
    const curPoint = getPointAt(t);
    length += dist(prevPoint, curPoint);
    prevPoint = curPoint;
  }

  return { getPointAt, length };
}

export {CubicBezier}
export type {CubicBezierI}
