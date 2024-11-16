import { circle } from './circle';
import { rect } from './rect';
import { ellipse } from './ellipse';
import { line } from './line';
import { polyline } from './polyline';
import { polygon } from './polygon';
import { path } from './path';

export type elements = Array<rect | circle | ellipse | line | polyline | polygon | path>;
