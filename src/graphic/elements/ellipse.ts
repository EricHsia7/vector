import { cx, cy, rx, ry, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, elementType } from '../attributes/index.ts';

export interface ellipse {
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
  type: elementType;
}

export function buildEllipse(cx: cx, cy: cy, rx: rx, ry: ry, fill: fill, stroke: stroke, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, strokeLinecap: strokeLinecap, strokeLinejoin: strokeLinejoin, transform: transform, opacity: opacity, visibility: visibility): ellipse {
  return {
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
    type: 'ellipse'
  };
}
