export type elementType = 'rect' | 'circle' | 'path';

export type x = number; // The x-coordinate of the upper-left corner
export type y = number; // The y-coordinate of the upper-left corner
export type cx = number; // The x-coordinate of the center
export type cy = number; // The y-coordinate of the center
export type r = number; //radius
export type width = number; // The width of the rectangle
export type height = number; // The height of the rectangle
export type rx = number; // The x-axis radius for rounded corners
export type ry = number; // The y-axis radius for rounded corners
export type deg = number;
export type rad = number;

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

export interface coordinate {
  x: x;
  y: y;
}
