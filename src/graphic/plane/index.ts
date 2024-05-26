import { rect } from '../elements/rect.ts';
import { circle } from '../elements/circle.ts';

export interface plane {
  x: number;
  y: number;
  width: number;
  height: number;
  elements: (rect | circle)[];
  subPlanes: plane[];
  type: 'plane';
}

export function buildPlane(x, y, width, height, elements): plane {
  return {
    x: x || 0,
    y: y || 0,
    width: width || 0,
    height: height || 0,
    elements: elements || [],
    subPlanes: [],
    type: 'plane'
  };
}
