import { useState, useEffect, useRef, useMemo, ReactElement } from "react";
import { pathParser } from "./math/PathParser";
import { CubicBezierSpline, CubicBezierSplineI } from "./math/BezierSpline";
import { BezierSplineProjection } from "./math/BezierSplineProjection";
import React from "react";
import { dist } from "./math/Point";
import { validateChildren } from "./validateChildren";

interface BezierInputProps {
  children: React.ReactElement<SVGSVGElement>;
  maxDistance: number;
  inputOptions?: {
    min: number;
    max: number;
    defaultValue?: number;
  };
  onInput: (value: number) => void;
  controlClassName?: {
    base?: string;
    active?: string;
  };
}

const defaultInputOptions = {
  min: 0,
  max: 100,
};

function BezierInput({
  children,
  inputOptions = defaultInputOptions,
  onInput,
  maxDistance = Infinity,
  controlClassName,
}: BezierInputProps) {

  validateChildren(children);

  const { min, max } = inputOptions;
  const defaultValue = inputOptions.defaultValue || (min + max) / 2;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);

  const SVG = useMemo(
    () =>
      React.cloneElement(
        children as ReactElement,
        { ref: svgRef },
        <>
          {children.props.children}
          <circle
            ref={circleRef}
            r="10"
            fill="white"
            className={controlClassName?.base || ""}
          ></circle>
        </>
      ),
    []
  );

  const [active, setActive] = useState(false);
  const [spline, setSpline] = useState<CubicBezierSplineI>();
  const [viewBox, setViewBox] = useState<{ width: number; height: number }>();

  useEffect(() => {
    onInput(defaultValue);

    const d = svgRef.current?.children[0].getAttribute("d");
    const points = pathParser("" + d);
    const _spline = CubicBezierSpline(points);
    setSpline(_spline);

    const viewBoxParams = svgRef.current?.getAttribute("viewBox")?.split(" ");
    setViewBox({
      width: Number(viewBoxParams?.at(-2)),
      height: Number(viewBoxParams?.at(-1)),
    });

    const ratio = (defaultValue - min) / (max - min);
    const point = _spline.getPointAt(ratio);
    moveCircle(point.x, point.y);
  }, []);

  useEffect(() => {
    const activeClassNames = controlClassName?.active?.split(" ") || " ";
    if (active) {
      circleRef.current?.classList.add(...activeClassNames);
    } else {
      circleRef.current?.classList.remove(...activeClassNames);
    }
  }, [active]);

  function convertToViewBoxCoordinates(x: number, y: number) {
    if (!svgRef.current || !viewBox) return { x: 0, y: 0 };
    return {
      x: (x / svgRef.current.clientWidth) * viewBox.width,
      y: (y / svgRef.current.clientHeight) * viewBox.height,
    };
  }

  function handleInput(e: React.PointerEvent<HTMLDivElement>) {
    if (!spline) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = convertToViewBoxCoordinates(offsetX, offsetY);
    const { point, t } = BezierSplineProjection({ x, y }, spline);

    if (dist(point, { x, y }) > maxDistance) {
      setActive(false);
      return;
    }

    moveCircle(point.x, point.y);

    const value = min + (max - min) * t;
    onInput(value);
  }

  function moveCircle(x: number, y: number) {
    if (!circleRef.current) return;
    circleRef.current.style.cx = "" + x;
    circleRef.current.style.cy = "" + y;
  }

  return (
    <div
      role="slider"
      onPointerMove={(e) => {
        if (!active) return;
        handleInput(e);
      }}
      onPointerDown={(e) => {
        setActive(true);
        handleInput(e);
      }}
      onPointerLeave={(e) => {
        setActive(false);
      }}
      onPointerUp={(e) => {
        setActive(false);
      }}
      style={{ width: "fit-content", height: "fit-content" }}
    >
      {SVG}
    </div>
  );
}

export default BezierInput;
