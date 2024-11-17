import { uuidv4 } from '../../utilities/index';
import { x, y, width, height, id } from '../attributes/index';
import { elements } from '../elements/index';

type root = boolean;

export interface plane {
  x: x;
  y: y;
  width: width;
  height: height;
  root: root;
  elements: elements;
  subPlanes: Array<plane>;
  id: id;
  type: 'plane';
}

export function buildPlane(x: x, y: y, width: width, height: height, root: root, elements: elements, subPlanes: Array<plane>): plane {
  return {
    x: root ? 0 : x || 0,
    y: root ? 0 : y || 0,
    width: width || 0,
    height: height || 0,
    root: root || false,
    elements: elements || [],
    subPlanes: subPlanes || [],
    id: uuidv4(),
    type: 'plane'
  };
}
