import { cx, cy, rx, ry, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType, x, y } from '../attributes/index';
import { uuidv4 } from '../../tools/index';

export interface ellipse {
  x: x;
  y: y;
  cx: cx;
  cy: cy;
  rx: rx;
  ry: ry;

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

export function buildEllipse(x: x, y: y, cx: cx, cy: cy, rx: rx, ry: ry, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): ellipse {
  return {
    x: x || 0,
    y: y || 0,
    cx: cx || 0,
    cy: cy || 0,
    rx: rx || 0,
    ry: ry || 0,
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
    type: 'ellipse'
  };
}
