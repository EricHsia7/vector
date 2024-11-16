export type elementType = 'rect' | 'circle' | 'ellipse' | 'line' | 'polyline' | 'polygon' | 'path';

export type x = number; // The x-coordinate of the upper-left corner
export type y = number; // The y-coordinate of the upper-left corner
export type cx = number; // The x-coordinate of the center
export type cy = number; // The y-coordinate of the center
export type r = number; // The radius of a circle
export type width = number; // The width of the rectangle
export type height = number; // The height of the rectangle
export type rx = number; // The x-axis radius (for rounded corners)
export type ry = number; // The y-axis radius (for rounded corners)
export type deg = number; // The angle in degrees
export type rad = number; // The angle in radius

export interface point {
  x: x;
  y: y;
}

export type points = Array<point>;

interface moveTo {
  type: 'M';
  x: x;
  y: y;
}

interface lineTo {
  type: 'L';
  x: x;
  y: y;
}

interface horizontalLineTo {
  type: 'H';
  x: x;
}

interface verticalLineTo {
  type: 'V';
  y: y;
}

interface cubicBezierCurve {
  type: 'C';
  x1: x; // starting control point x
  y1: y; // starting control point y
  x2: x; // ending control point x
  y2: y; // ending control point y
  x: x; // ending point x
  y: y; // ending point x
}

interface smoothCurveTo {
  type: 'S';
  x2: x;
  y2: y;
}

interface quadraticBezier {
  type: 'Q';
  x1: x; // control point x
  y1: y; // control point y
  x: x;
  y: y;
}

interface smoothQuadraticTo {
  type: 'T';
  x: x;
  y: y;
}

interface arc {
  type: 'A';
  rx: rx;
  ry: ry;
  xAxisRotation: any;
  largeArcFlag: any;
  sweepFlag: any;
  x: x;
  y: y;
}

interface closePath {
  type: 'Z';
}

export type d = (moveTo | lineTo | horizontalLineTo | verticalLineTo | cubicBezierCurve | smoothCurveTo | quadraticBezier | smoothQuadraticTo | arc | closePath)[];

// Presentation attributes
export type fill = string | null; // The fill color or pattern
export type stroke = string; // The stroke color or pattern
export type strokeWidth = string; // The width of the stroke
export type strokeDasharray = string; // Pattern of dashes and gaps for the stroke
export type strokeLinecap = 'butt' | 'round' | 'square'; // Shape at the end of open subpaths
export type strokeLinejoin = 'miter' | 'round' | 'bevel'; // Shape at the corners of paths

// Additional attributes
export type opacity = number; // Transparency level (0 to 1)
export type visibility = 'visible' | 'hidden' | 'collapse'; // Visibility of the rectangle

export interface translate {
  x: x;
  y: y;
  type: 'translate';
}

export interface scale {
  x: x;
  y: y;
  type: 'scale';
}

export interface rotate {
  deg: deg;
  type: 'rotate';
}

export interface skewX {
  deg: deg;
  type: 'skewX';
}

export interface skewY {
  deg: deg;
  type: 'skewY';
}

export type matrix = number[][];

export type transform = (translate | scale | rotate | skewX | skewY)[];

export type id = string;
