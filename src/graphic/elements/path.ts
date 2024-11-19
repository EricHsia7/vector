import { d, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType, point, points } from '../attributes/index';
import { uuidv4 } from '../../utilities/index';
import { rect } from './rect';
import { circle } from './circle';
import { ellipse } from './ellipse';
import { line } from './line';
import { polyline } from './polyline';
import { polygon } from './polygon';

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

export function samplePath(path: path, precision: number): points {
  const commands = path.d;
  let points: points = [];

  function interpolateLinear(p0: point, p1: point, precision: number): points {
    let segmentPoints: points = [];
    const distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = distance / precision;
    for (let i = 0; i < step; i++) {
      const t = Math.min(Math.max(i / step, 0), 1);
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
    for (let i = 0; i < step; i++) {
      const t = Math.min(Math.max(i / step, 0), 1);
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
    for (let i = 0; i < step; i++) {
      const t = Math.min(Math.max(i / step, 0), 1);
      const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * c.x;
      const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * c.y;
      segmentPoints.push({ x, y });
    }
    return segmentPoints;
  }

  function interpolateArc(p0: point, rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, p1: point, precision: number): points {
    const distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const step = Math.round(distance / precision);
    /**
     * Interpolates points on an arc defined by the SVG path command "A".
     *
     * Parameters:
     * - rx, ry: Radii of the ellipse.
     * - xAxisRotation: Rotation of the ellipse's x-axis in degrees.
     * - largeArcFlag: 1 for the large arc, 0 for the small arc.
     * - sweepFlag: 1 for clockwise, 0 for counterclockwise.
     * - start, end: {x, y} coordinates of the start and end points.
     * - numPoints: Number of points to interpolate along the arc.
     *
     * Returns:
     * - Array of {x, y} pairs representing the interpolated points.
     */

    // Convert rotation to radians
    const xAxisRotationRad = (xAxisRotation * Math.PI) / 180;

    // Translate start and end points to center the ellipse at origin
    const dx = (p0.x - p1.x) / 2;
    const dy = (p0.y - p1.y) / 2;
    const cosPhi = Math.cos(xAxisRotationRad);
    const sinPhi = Math.sin(xAxisRotationRad);

    const x1Prime = cosPhi * dx + sinPhi * dy;
    const y1Prime = -sinPhi * dx + cosPhi * dy;

    // Corrected radii to ensure proper scaling
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    const lambdaFactor = Math.pow(x1Prime, 2) / Math.pow(rx, 2) + Math.pow(y1Prime, 2) / Math.pow(ry, 2);
    if (lambdaFactor > 1) {
      rx *= Math.sqrt(lambdaFactor);
      ry *= Math.sqrt(lambdaFactor);
    }

    // Compute center of the ellipse
    let numerator = Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(y1Prime, 2) - Math.pow(ry, 2) * Math.pow(x1Prime, 2);
    const denominator = Math.pow(rx, 2) * Math.pow(y1Prime, 2) + Math.pow(ry, 2) * Math.pow(x1Prime, 2);
    if (numerator < 0) numerator = 0; // Handle rounding issues

    let factor = Math.sqrt(numerator / denominator);
    if (largeArcFlag !== sweepFlag) {
      factor = -factor;
    }

    const cxPrime = (factor * rx * y1Prime) / ry;
    const cyPrime = (-factor * ry * x1Prime) / rx;

    const cx = cosPhi * cxPrime - sinPhi * cyPrime + (p0.x + p1.x) / 2;
    const cy = sinPhi * cxPrime + cosPhi * cyPrime + (p0.y + p1.y) / 2;

    // Compute start and end angles
    const theta1 = Math.atan2((y1Prime - cyPrime) / ry, (x1Prime - cxPrime) / rx);
    let deltaTheta = Math.atan2((-y1Prime - cyPrime) / ry, (-x1Prime - cxPrime) / rx) - theta1;

    if (sweepFlag === 0 && deltaTheta > 0) {
      deltaTheta -= 2 * Math.PI;
    } else if (sweepFlag === 1 && deltaTheta < 0) {
      deltaTheta += 2 * Math.PI;
    }

    // Generate points along the arc
    const t = Array.from({ length: step }, (_, i) => i / (step - 1));
    const angles = t.map((ti) => theta1 + deltaTheta * ti);

    const segmentPoints = angles.map((angle) => {
      const x = cx + rx * Math.cos(angle) * cosPhi - ry * Math.sin(angle) * sinPhi;
      const y = cy + rx * Math.cos(angle) * sinPhi + ry * Math.sin(angle) * cosPhi;
      return { x, y };
    });
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
    const nextSimplifiedPoint = simplifiedPoints[i + 1] || currentSimplifiedPoint;
    if (i === 0) {
      simplifiedCommands.push({ type: 'M', x: currentSimplifiedPoint.x, y: currentSimplifiedPoint.y });
    } else {
      if (i === simplifiedPointsLength - 1) {
        simplifiedCommands.push({ type: 'L', x: currentSimplifiedPoint.x, y: currentSimplifiedPoint.y });
      } else {
        simplifiedCommands.push({ type: 'Q', x1: currentSimplifiedPoint.x, y1: currentSimplifiedPoint.y, x: (currentSimplifiedPoint.x + nextSimplifiedPoint.x) / 2, y: (currentSimplifiedPoint.y + nextSimplifiedPoint.y) / 2 });
      }
    }
  }
  path.d = simplifiedCommands;
  return path;
}

export function buildPathFromElement(element: element): path {
  function rectToCommands(element: rect): d {
    const x = element.x;
    const y = element.y;
    const width = element.width;
    const height = element.height;
    const rx = element.rx || 0;
    const ry = element.ry || 0;

    let commands: d = [];
    if (rx === 0 && ry === 0) {
      commands.push({ type: 'M', x: x, y: y });
      commands.push({ type: 'H', x: x + width });
      commands.push({ type: 'V', y: y + height });
      commands.push({ type: 'H', x: x });
      commands.push({ type: 'Z' });
    } else {
      rx = rx || ry;
      ry = ry || rx;
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
    default:
      throw new Error(`Unsupported element: ${element?.type}`);
  }
  return buildPath(commands, element?.fill, element?.stroke, element?.strokeWidth, element?.strokeDasharray, element?.strokeLinecap, element?.strokeLinejoin, element?.transform, element?.opacity, element?.visibility);
}
