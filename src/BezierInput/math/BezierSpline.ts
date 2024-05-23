import type { CubicBezierI } from "./BezierCurve";
import type { Point } from "./Point";
import { CubicBezier } from "./BezierCurve";


interface CubicBezierSplineI extends CubicBezierI {
  pieces: CubicBezierI[];
}

/**
 *
 * @param {Point[]} points - array of points in the same order as in the `d` attribute of `<path>`
 * @returns
 */

export function CubicBezierSpline(points: Point[]): CubicBezierSplineI {
  const pieces: CubicBezierI[] = [];

  for(let i = 0; i < points.length; i += 4){
    pieces.push(CubicBezier(points.slice(i, i + 4)));
  }

  const totalLength = pieces.reduce((len, part) => len + part.length, 0);

  /**
   *
   * @param {number} t - parameter of a spline, 0 <= t <= 1
   * @returns {Point} the point with the corresponding parameter
   */
  function getPointAt(t: number): Point {
    const lengthFromStart = totalLength * t;

    let index = 0;
    let accumulatedLength = 0;
    for (; index < pieces.length; index++) {
      const curLength = pieces[index].length;
      if (accumulatedLength + curLength >= lengthFromStart) break;
      accumulatedLength += curLength;
    }

    // this assumes that dt ~ dl which is generally false, but we can accept that it is close enough
    const tOnPiece =
      (lengthFromStart - accumulatedLength) / pieces[index].length;

    return pieces[index].getPointAt(tOnPiece);
  }

  return { getPointAt, length: totalLength, pieces };
}

export type { CubicBezierI, CubicBezierSplineI };
