import { circle } from './circle.ts';
import { rect } from './rect.ts';
import { ellipse } from './ellipse.ts';
import { line } from './line.ts';
import { polyline } from './polyline.ts';

export type elements = (rect | circle | ellipse | line | polyline)[];
