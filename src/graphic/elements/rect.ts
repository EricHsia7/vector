import { x, y, width, height, rx, ry, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, id, elementType } from '../attributes/index.ts';
import { uuidv4 } from '../../tools/index.ts';

export interface rect {
  x: x;
  y: y;
  width: width;
  height: height;
  rx?: rx;
  ry?: ry;

  fill?: fill;
  stroke?: stroke;
  strokeWidth?: strokeWidth;
  strokeDasharray?: strokeDasharray;
  strokeLinecap?: strokeLinecap;
  strokeLinejoin?: strokeLinejoin;

  transform?: transform; // Transformations applied to the rectangle
  opacity?: opacity;
  visibility?: visibility;
  id: id;
  type: elementType;
}

export function buildRect(x: x, y: y, width: width, height: height, rx: rx, ry: ry, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): rect {
  return {
    x: x || 0,
    y: y || 0,
    width: width || 0,
    height: height || 0,
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
    type: 'rect'
  };
}
