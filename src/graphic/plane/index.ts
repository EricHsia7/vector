import { rect } from '../elements/rect.ts';
import { circle } from '../elements/circle.ts';

export interface plane {
  x: number;
  y: number;
  width: number;
  height: number;
  root: boolean;
  elements: (rect | circle)[];
  subPlanes: plane[];
  type: 'plane';
}

export function buildPlane(x, y, width, height, root, elements, subPlanes): plane {
  return {
    x: root ? 0 : x || 0,
    y: root ? 0 : y || 0,
    width: width || 0,
    height: height || 0,
    root: root || false,
    elements: elements || [],
    subPlanes: subPlanes || [],
    type: 'plane'
  };
}
