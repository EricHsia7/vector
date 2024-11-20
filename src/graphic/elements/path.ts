import { d, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType, point, points } from '../attributes/index';
import { uuidv4 } from '../../utilities/index';
import { rect } from './rect';
import { circle } from './circle';
import { ellipse } from './ellipse';
import { line } from './line';
import { polyline } from './polyline';
import { polygon } from './polygon';
import { element } from './index';
import { transformPoints } from '../transformation/index';

export interface path {
  d: d;

  fill?: fill;
  stroke?: stroke;
  strokeWidth?: strokeWidth;
  strokeDasharray?: strokeDasharray;
  strokeLinecap?: strokeLinecap;
  strokeLinejoin?: strokeLinejoin;

  transform?: transform; // Transformations applied to the path
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

export function samplePath(path: path, precision: number = 1, flatten: boolean = false): points {
  const commands = path.d;
  let points: points = [];

  function interpolateLinear(p0: point, p1: point, precision: number): points {
    let segmentPoints: points = [];
    const distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = distance / precision;
    for (let i = 0; i <= step; i++) {
      const t = i / step;
      const x = p0.x + (p1.x - p0.x) * t;
      const y = p0.y + (p1.y - p0.y) * t;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateCubicBezier(p0: point, c1: point, c2: point, p1: point, precision: number): points {
    let segmentPoints: points = [];
    const distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = distance / precision;
    for (let i = 0; i <= step; i++) {
      const t = i / step;
      const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * c1.x + 3 * (1 - t) * Math.pow(t, 2) * c2.x + Math.pow(t, 3) * p1.x;
      const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * c1.y + 3 * (1 - t) * Math.pow(t, 2) * c2.y + Math.pow(t, 3) * p1.y;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateQuadraticBezier(p0: point, c: point, p1: point, precision: number): points {
    let segmentPoints: points = [];
    const distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = distance / precision;
    for (let i = 0; i <= step; i++) {
      const t = i / step;
      const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * c.x;
      const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * c.y;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateArc(p0: point, rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number, precision: number): points {
    const distance = Math.hypot(x - p0.x, y - p0.y);
    const step = Math.round(distance / precision);

    // Helper to convert degrees to radians
    const degToRad = (deg) => (deg * Math.PI) / 180;

    // Calculate rotation matrix
    const rotationRad = degToRad(xAxisRotation);
    const cosRot = Math.cos(rotationRad);
    const sinRot = Math.sin(rotationRad);

    // Compute center of the ellipse and the angles
    const dx = (p0.x - x) / 2;
    const dy = (p0.y - y) / 2;

    // Transform to the ellipse's coordinate space
    const x1p = cosRot * dx + sinRot * dy;
    const y1p = -sinRot * dx + cosRot * dy;

    // Correct radii if necessary
    const rxSq = rx ** 2;
    const rySq = ry ** 2;
    const x1pSq = x1p ** 2;
    const y1pSq = y1p ** 2;

    let radicant = (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq);
    radicant = Math.max(0, radicant); // Ensure non-negative
    const coef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(radicant);

    const cxp = coef * ((rx * y1p) / ry);
    const cyp = coef * (-(ry * x1p) / rx);

    // Transform back to the original coordinate space
    const cx = cosRot * cxp - sinRot * cyp + (p0.x + x) / 2;
    const cy = sinRot * cxp + cosRot * cyp + (p0.y + y) / 2;

    // Start and end angles
    const theta1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
    const deltaTheta = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - theta1;

    // Ensure the angle is swept in the correct direction
    const adjustedDeltaTheta = sweepFlag === 0 && deltaTheta > 0 ? deltaTheta - 2 * Math.PI : deltaTheta;
    const finalDeltaTheta = sweepFlag === 1 && deltaTheta < 0 ? deltaTheta + 2 * Math.PI : adjustedDeltaTheta;

    // Sample the arc
    const segmentPoints = [];
    for (let i = 0; i <= step; i++) {
      const t = i / step; // Proportion of the arc
      const theta = theta1 + t * finalDeltaTheta;

      // Parametric equation of the ellipse
      const x = cosRot * (rx * Math.cos(theta)) - sinRot * (ry * Math.sin(theta)) + cx;
      const y = sinRot * (rx * Math.cos(theta)) + cosRot * (ry * Math.sin(theta)) + cy;

      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  let currentPoint: point = { x: 0, y: 0 };
  let previousControlPoint: point | null = null;

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
        const quadControl = { x: command.x, y: command.y };
        const quadEnd = { x: command.x1, y: command.y1 };
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
        points.push(...interpolateArc(currentPoint, command.rx, command.ry, command.xAxisRotation, command.largeArcFlag, command.sweepFlag, command.x, command.y, precision));
        currentPoint = { x: command.x, y: command.y };
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
  if (flatten) {
    if (typeof path.transform === 'object' && Array.isArray(path.transform)) {
      if (path.transform.length > 0) {
        points = transformPoints(points, path.transform);
      }
    }
  }
  return points;
}

export function smoothPath(path: path): path {
  function simplifyPoints(points: points, tolerance: number): points {
    function distanceToSegment(point: point, start: point, end: point): number {
      let dx = end.x - start.x;
      let dy = end.y - start.y;
      let d = dx * dx + dy * dy;
      let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / d;

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

  const points = samplePath(path, 1);
  const simplifiedPoints = simplifyPoints(points, 1);
  const simplifiedPointsLength = simplifiedPoints.length;
  let simplifiedCommands = [];

  for (let i = 0; i < simplifiedPointsLength; i++) {
    const currentSimplifiedPoint = simplifiedPoints[i];
    const previousSimplifiedPoint = simplifiedPoints[i - 1] || currentSimplifiedPoint;
    const nextSimplifiedPoint = simplifiedPoints[i + 1] || currentSimplifiedPoint;
    if (i === 0) {
      simplifiedCommands.push({ type: 'M', x: currentSimplifiedPoint.x, y: currentSimplifiedPoint.y });
    } else {
      if (i === simplifiedPointsLength - 1) {
        simplifiedCommands.push({ type: 'Q', x1: currentSimplifiedPoint.x, y1: currentSimplifiedPoint.y, x: (currentSimplifiedPoint.x + previousSimplifiedPoint.x) / 2, y: (currentSimplifiedPoint.y + previousSimplifiedPoint.y) / 2 });
      } else {
        simplifiedCommands.push({ type: 'Q', x1: currentSimplifiedPoint.x, y1: currentSimplifiedPoint.y, x: (currentSimplifiedPoint.x + nextSimplifiedPoint.x) / 2, y: (currentSimplifiedPoint.y + nextSimplifiedPoint.y) / 2 });
      }
    }
  }
  path.d = simplifiedCommands;
  return path;
}

export function elementToCommands(element: element): d {
  function rectToCommands(element: rect): d {
    const x = element.x;
    const y = element.y;
    const width = element.width;
    const height = element.height;
    let rx = element.rx || 0;
    let ry = element.ry || 0;

    let commands: d = [];
    if (rx === 0 && ry === 0) {
      commands.push({ type: 'M', x: x, y: y });
      commands.push({ type: 'H', x: x + width });
      commands.push({ type: 'V', y: y + height });
      commands.push({ type: 'H', x: x });
      commands.push({ type: 'Z' });
    } else {
      commands.push({ type: 'M', x: x + rx, y: y });
      commands.push({ type: 'H', x: x + width - rx });
      commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: x + width, y: y + ry });
      commands.push({ type: 'V', y: y + height - ry });
      commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: x + width - rx, y: y + height });
      commands.push({ type: 'H', x: x + rx });
      commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: x, y: y + height - ry });
      commands.push({ type: 'V', y: y + ry });
      commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: x + rx, y: y });
      commands.push({ type: 'Z' });
    }
    return commands;
  }

  function circleToCommands(element: circle): d {
    const cx = element.cx;
    const cy = element.cy;
    const r = element.r;
    let commands: d = [];
    commands.push({ type: 'M', x: cx - r, y: cy });
    commands.push({ type: 'A', rx: r, ry: r, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: cx + r, y: cy });
    commands.push({ type: 'A', rx: r, ry: r, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: cx - r, y: cy });
    commands.push({ type: 'Z' });
    return commands;
  }

  function ellipseToCommands(element: ellipse): d {
    const cx = element.cx;
    const cy = element.cy;
    const rx = element.rx;
    const ry = element.ry;
    let commands: d = [];
    commands.push({ type: 'M', x: cx - rx, y: cy });
    commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: cx + rx, y: cy });
    commands.push({ type: 'A', rx: rx, ry: ry, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: cx - rx, y: cy });
    commands.push({ type: 'Z' });
    return commands;
  }

  function lineToCommands(element: line): d {
    const x1 = element.x1;
    const y1 = element.y1;
    const x2 = element.x2;
    const y2 = element.y2;
    let commands: d = [];
    commands.push({ type: 'M', x: x1, y: y1 });
    commands.push({ type: 'L', x: x2, y: y2 });
    return commands;
  }

  function polyToCommands(element: polyline | polygon): d {
    const points = element.points;
    let commands: d = [];
    let index = 0;
    for (const point of points) {
      const x = point.x;
      const y = point.y;
      if (index === 0) {
        commands.push({ type: 'M', x: x, y: y });
      } else {
        commands.push({ type: 'L', x: x, y: y });
      }
      index += 1;
    }
    if (element.type === 'polygon') {
      commands.push({ type: 'Z' });
    }
    return commands;
  }

  let commands = [];
  switch (element.type) {
    case 'rect':
      commands = rectToCommands(element);
      break;
    case 'circle':
      commands = circleToCommands(element);
      break;
    case 'ellipse':
      commands = ellipseToCommands(element);
      break;
    case 'line':
      commands = lineToCommands(element);
      break;
    case 'polyline':
      commands = polyToCommands(element);
      break;
    case 'polygon':
      commands = polyToCommands(element);
      break;
    case 'path':
      commands = element.d;
      break;
    default:
      throw new Error(`Unsupported element: ${element?.type}`);
  }
  return commands;
}

export function buildPathFromElement(element: element): path {
  const commands = elementToCommands(element);
  return buildPath(commands, element?.fill, element?.stroke, element?.strokeWidth, element?.strokeDasharray, element?.strokeLinecap, element?.strokeLinejoin, element?.transform, element?.opacity, element?.visibility);
}
