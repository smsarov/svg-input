type Point = {
  x: number;
  y: number;
};

function addPoints(points: Point[]): Point {
  return points.reduce(
    (sum, p) => {
      return {
        x: sum.x + p.x,
        y: sum.y + p.y,
      };
    },
    { x: 0, y: 0 }
  );
}

function multByNumber(point: Point, n: number): Point {
  return {
    x: point.x * n,
    y: point.y * n,
  };
}

function dist(point1 : Point, point2: Point){
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

export type { Point };

export { addPoints, multByNumber, dist };
