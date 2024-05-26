import { x, y, width, height, rx, ry, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, opacity, visibility, transform, elementType } from '../attributes/index.ts';

export interface SVGRect {
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
  elementType: elementType;
}

export function buildSVGRect(x, y, width, height, rx, ry, fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, strokeLinejoin, transform): SVGRect {}
