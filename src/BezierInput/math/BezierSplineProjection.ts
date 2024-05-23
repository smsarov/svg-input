import type { Point } from "./Point";
import { dist } from "./Point";
import type { CubicBezierSplineI } from "./BezierSpline";

/**
 * the algo is not guaranteed to work, a lot of testing is required
 * @param point - the point we want to project
 * @param spline - the spline on which to project the point
 * @returns
 */

export function BezierSplineProjection(
  point: Point,
  spline: CubicBezierSplineI
) {
  // kinda binary search but it actually isn't
  // probably need to involve more math, it is a bit complicated though

  let l = 0,
    r = 1;
  let minimalDistanceParameter = l;
  let minimalDistance = Infinity;

  for (let i = 0; i < 10; i++) {
    const searchWidth = r - l;
    for (let t = l; t < r; t += searchWidth / 16 / spline.pieces.length) {
      const curPoint = spline.getPointAt(t);
      const d = dist(curPoint, point);
      if (d < minimalDistance) {
        minimalDistance = d;
        minimalDistanceParameter = t;
      }
    }

    l = Math.max(0, minimalDistanceParameter - searchWidth / 4);
    r = Math.min(1, minimalDistanceParameter + searchWidth / 4);
  }

  return {
    point: spline.getPointAt(minimalDistanceParameter),
    t: minimalDistanceParameter,
  };
}
