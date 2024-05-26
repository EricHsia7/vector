import { cx, cy, r, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, elementType } from '../attributes/index.ts';

export interface circle {
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
  type: elementType;
}

export function buildCircle(cx: cx, cy: cy, r: r, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): circle {
  return {
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
    type: 'rect'
  };
}
