import { x, y, cx, cy, r, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType } from '../attributes/index.ts';
import { uuidv4 } from '../../tools/index.ts';

export interface circle {
  x: x;
  y: y;
  cx: cx;
  cy: cy;
  r: r;

  fill?: fill;
  stroke?: stroke;
  strokeWidth?: strokeWidth;
  strokeDasharray?: strokeDasharray;
  strokeLinecap?: strokeLinecap;
  strokeLinejoin?: strokeLinejoin;

  transform?: transform;
  opacity?: opacity;
  visibility?: visibility;
  id: id;
  type: elementType;
}

export function buildCircle(x: x, y: y, cx: cx, cy: cy, r: r, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): circle {
  return {
    x: x || 0,
    y: y || 0,
    cx: cx || 0,
    cy: cy || 0,
    r: r || 0,
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
    type: 'circle'
  };
}
