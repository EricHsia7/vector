import { d, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType, coordinate, points } from '../attributes/index';
import { uuidv4 } from '../../tools/index';

export interface path {
  d: d;

  fill?: fill;
  stroke?: stroke;
  strokeWidth?: strokeWidth;
  strokeDasharray?: strokeDasharray;
  strokeLinecap?: strokeLinecap;
  strokeLinejoin?: strokeLinejoin;

  transform?: transform; // Transformations applied to the line
  opacity?: opacity;
  visibility?: visibility;
  id: id;
  type: elementType;
}

export function buildPath(d: d, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): path {
  return {
    d: d || [],
    fill: fill || 'none',
    stroke: stroke || 'none',
    strokeWidth: strokeWidth || 0,
    strokeDasharray: strokeDasharray || '',
    strokeLinecap: strokeLinecap || 'butt',
    strokeLinejoin: strokeLinejoin || 'miter',
    transform: transform || [],
    opacity: opacity || 1,
    visibility: visibility || 'visible',
    id: uuidv4(),
    type: 'path'
  };
}

export function samplePath(path: path, precision: number): points {
  let commands = path.d;
  const points: points = [];

  function interpolateLinear(p1: coordinate, p2: coordinate, step: number): points {
    const segmentPoints: points = [];
    const dx = (p2.x - p1.x) / step;
    const dy = (p2.y - p1.y) / step;
    for (let i = 1; i <= step; i++) {
      segmentPoints.push({ x: p1.x + dx * i, y: p1.y + dy * i });
    }
    return segmentPoints;
  }

  function interpolateCubicBezier(p0: coordinate, c1: coordinate, c2: coordinate, p1: coordinate, step: number): points {
    const segmentPoints: points = [];
    for (let t = 0; t <= 1; t += 1 / step) {
      const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * c1.x + 3 * (1 - t) * Math.pow(t, 2) * c2.x + Math.pow(t, 3) * p1.x;
      const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * c1.y + 3 * (1 - t) * Math.pow(t, 2) * c2.y + Math.pow(t, 3) * p1.y;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateQuadraticBezier(p0: coordinate, c: coordinate, p1: coordinate, step: number): points {
    const segmentPoints: points = [];
    for (let t = 0; t <= 1; t += 1 / step) {
      const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * c.x + Math.pow(t, 2) * p1.x;
      const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * c.y + Math.pow(t, 2) * p1.y;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateArc(p0: coordinate, rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, p1: coordinate, step: number): points {
    const segmentPoints: points = [];
    for (let t = 0; t <= 1; t += 1 / step) {
      const theta = t * Math.PI * 2;
      segmentPoints.push({
        x: p0.x + rx * Math.cos(theta),
        y: p0.y + ry * Math.sin(theta)
      });
    }
    return segmentPoints;
  }

  let currentPoint: coordinate = { x: 0, y: 0 };
  let previousControlPoint: coordinate | null = null;

  for (const command of commands) {
    switch (command.type) {
      case 'M':
        currentPoint = { x: command.x, y: command.y };
        points.push(currentPoint);
        previousControlPoint = null;
        break;

      case 'L':
        const lineEnd = { x: command.x, y: command.y };
        points.push(...interpolateLinear(currentPoint, lineEnd, precision));
        currentPoint = lineEnd;
        previousControlPoint = null;
        break;

      case 'H':
        const horizontalEnd = { x: command.x, y: currentPoint.y };
        points.push(...interpolateLinear(currentPoint, horizontalEnd, precision));
        currentPoint = horizontalEnd;
        previousControlPoint = null;
        break;

      case 'V':
        const verticalEnd = { x: currentPoint.x, y: command.y };
        points.push(...interpolateLinear(currentPoint, verticalEnd, precision));
        currentPoint = verticalEnd;
        previousControlPoint = null;
        break;

      case 'C':
        const cubicStart = currentPoint;
        const cubicControl1 = { x: command.x1, y: command.y1 };
        const cubicControl2 = { x: command.x2, y: command.y2 };
        const cubicEnd = { x: command.x, y: command.y };
        points.push(...interpolateCubicBezier(cubicStart, cubicControl1, cubicControl2, cubicEnd, precision));
        currentPoint = cubicEnd;
        previousControlPoint = cubicControl2;
        break;

      case 'S':
        const smoothStart = currentPoint;
        const smoothControl1 = previousControlPoint ? { x: 2 * smoothStart.x - previousControlPoint.x, y: 2 * smoothStart.y - previousControlPoint.y } : smoothStart;
        const smoothControl2 = { x: command.x2, y: command.y2 };
        const smoothEnd = { x: command.x, y: command.y };
        points.push(...interpolateCubicBezier(smoothStart, smoothControl1, smoothControl2, smoothEnd, precision));
        currentPoint = smoothEnd;
        previousControlPoint = smoothControl2;
        break;

      case 'Q':
        const quadStart = currentPoint;
        const quadControl = { x: command.x1, y: command.y1 };
        const quadEnd = { x: command.x, y: command.y };
        points.push(...interpolateQuadraticBezier(quadStart, quadControl, quadEnd, precision));
        currentPoint = quadEnd;
        previousControlPoint = quadControl;
        break;

      case 'T':
        const smoothQuadStart = currentPoint;
        const smoothQuadControl = previousControlPoint ? { x: 2 * smoothQuadStart.x - previousControlPoint.x, y: 2 * smoothQuadStart.y - previousControlPoint.y } : smoothQuadStart;
        const smoothQuadEnd = { x: command.x, y: command.y };
        points.push(...interpolateQuadraticBezier(smoothQuadStart, smoothQuadControl, smoothQuadEnd, precision));
        currentPoint = smoothQuadEnd;
        previousControlPoint = smoothQuadControl;
        break;

      case 'A':
        const arcStart = currentPoint;
        const arcEnd = { x: command.x, y: command.y };
        points.push(...interpolateArc(arcStart, command.rx, command.ry, command.xAxisRotation, command.largeArcFlag, command.sweepFlag, arcEnd, precision));
        currentPoint = arcEnd;
        previousControlPoint = null;
        break;

      case 'Z':
        if (points.length > 0) {
          points.push(points[0]); // Close path by connecting to the start
        }
        previousControlPoint = null;
        break;

      default:
        throw new Error(`Unsupported command type: ${command.type}`);
    }
  }

  return points;
}

export function smoothPath(path: path): path {
  function simplifyPoints(points: points, tolerance: number): points {
    function distanceToSegment(point: coordinate, start: coordinate, end: coordinate): number {
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      var d = dx * dx + dy * dy;
      var t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / d;

      if (t < 0) {
        dx = point.x - start.x;
        dy = point.y - start.y;
      } else if (t > 1) {
        dx = point.x - end.x;
        dy = point.y - end.y;
      } else {
        var closestPoint = { x: start.x + t * dx, y: start.y + t * dy };
        dx = point.x - closestPoint.x;
        dy = point.y - closestPoint.y;
      }

      return Math.sqrt(dx * dx + dy * dy);
    }

    if (points.length < 3) {
      return points;
    }

    let dmax = 0;
    let index = 0;

    // Find the point with the maximum distance
    for (let i = 1; i < points.length - 1; i++) {
      let d = distanceToSegment(points[i], points[0], points[points.length - 1]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }

    // If max distance is greater than tolerance, split the curve
    if (dmax > tolerance) {
      let leftPoints = points.slice(0, index + 1);
      let rightPoints = points.slice(index);
      let simplifiedLeft = simplifyPoints(leftPoints, tolerance);
      let simplifiedRight = simplifyPoints(rightPoints, tolerance);
      return simplifiedLeft.slice(0, simplifiedLeft.length - 1).concat(simplifiedRight);
    } else {
      return [points[0], points[points.length - 1]];
    }
  }

  const points = samplePath(path, 3);
  const simplifiedPoints = simplifyPoints(points, 0.8);
  const simplifiedPointsLength = simplifiedPoints.length;
  let simplifiedCommands = [];
  for (let i = 0; i < simplifiedPointsLength; i++) {
    const currentSimplifiedPoint = simplifiedPoints[i];
    const nextSimplifiedPoint = simplifiedPoints[i + 1] || currentSimplifiedPoint;
    if (i === 0 || i === simplifiedPointsLength - 1) {
      simplifiedCommands.push({ type: 'M', x: currentSimplifiedPoint.x, y: currentSimplifiedPoint.y });
    } else {
      simplifiedCommands.push({ type: 'Q', x: currentSimplifiedPoint.x, y: currentSimplifiedPoint.y, x1: (currentSimplifiedPoint.x + nextSimplifiedPoint.x) / 2, y1: (currentSimplifiedPoint.y + nextSimplifiedPoint.y) / 2 });
    }
  }
  path.d = simplifiedCommands;
  return path;
}
