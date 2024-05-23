import type { Point } from "./Point";
import { addPoints, multByNumber } from "./Point";

export function pathParser(path: string) {
  const points: Point[] = [];

  // extremely inefficient but super simple
  const tokens = path
    .replaceAll(",", " ")
    .replace("M", "")
    .replaceAll("C", " C ")
    .replaceAll("S", " S ")
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token);

  // C -> 3 points -> 6 numbers
  // S -> 2 points -> 4 numbers

  let i = 0;

  while (i < tokens.length) {
    switch (tokens[i]) {
      case "C": {
        const [x0, y0] = tokens.slice(i - 2, i).map(Number);
        const [x1, y1, x2, y2, x3, y3] = tokens.slice(i + 1, i + 7).map(Number);

        points.push(
          { x: x0, y: y0 },
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x3, y: y3 }
        );
        i += 7;
        break;
      }

      case "S": {
        const prevPoint = points.at(-1) as Point;
        const prevPrevPoint = points.at(-2) as Point;

        const symmetricalControlPoint = addPoints([
          multByNumber(prevPoint, 2),
          multByNumber(prevPrevPoint, -1),
        ]);

        const [x3, y3, x4, y4] = tokens.slice(i + 1, i + 5).map(Number);
        points.push(
          prevPoint,
          symmetricalControlPoint,
          { x: x3, y: y3 },
          { x: x4, y: y4 }
        );

        i += 5;
        break;
      }
      default:
        i++;
    }
  }

  return points;
}
