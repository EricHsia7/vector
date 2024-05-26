import { x, y, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, elementType } from '../attributes/index.ts';

export interface line {
  x1: x;
  y1: y;
  x2: x;
  y2: y;

  stroke?: stroke;
  strokeWidth?: strokeWidth;
  strokeDasharray?: strokeDasharray;
  strokeLinecap?: strokeLinecap;
  strokeLinejoin?: strokeLinejoin;

  transform?: transform; // Transformations applied to the line
  opacity?: opacity;
  visibility?: visibility;
  type: elementType;
}

export function buildLine(x1: x, y1: y, x2: x, y2: y, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): line {
  return {
    x1: x1 || 0,
    y1: y1 || 0,
    x2: x2 || 0,
    y2: y2 || 0,
    stroke: stroke || 'none',
    strokeWidth: strokeWidth || 0,
    strokeDasharray: strokeDasharray || '',
    strokeLinecap: strokeLinecap || 'butt',
    strokeLinejoin: strokeLinejoin || 'miter',
    transform: transform || [],
    opacity: opacity || 1,
    visibility: visibility || 'visible',
    type: 'line'
  };
}
