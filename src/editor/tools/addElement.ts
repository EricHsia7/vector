import { vectorDocuments, vectorDocument } from '../index.ts';
import { elementType, stroke, fill, strokeWidth } from '../../graphic/attributes/index.ts';
import { elements } from '../../graphic/elements/index.ts';
import { buildRect } from '../../graphic/elements/rect.ts';
import { buildCircle } from '../../graphic/elements/circle.ts';
import { buildEllipse } from '../../graphic/elements/ellipse.ts';
import { buildLine } from '../../graphic/elements/line.ts';
import { buildPolyline } from '../../graphic/elements/polyline.ts';
import { buildPolygon } from '../../graphic/elements/polygon.ts';
import { buildPath } from '../../graphic/elements/path.ts';

var addingElement: elements;
var adding: boolean = false;
var defaultColor: fill | stroke = '#000';
var defaultStrokeWidth: strokeWidth = 3;

export function addElement(cursorX: number, cursorY: number, type: elementType): void {
  if (!adding) {
    if (type === 'rect') {
      addingElement = buildRect(cursorX, cursorY, 0, 0, 0, 0, defaultColor);
    }
    if (type === 'circle') {
      addingElement = buildCircle(cursorX, cursorY, cursorX, cursorY, 0, defaultColor);
    }
    if (type === 'ellipse') {
      addingElement = buildEllipse(cursorX, cursorY, 0, 0, defaultColor);
    }
    if (type === 'line') {
      addingElement = buildLine(cursorX, cursorY, cursorX, cursorY, defaultColor, defaultStrokeWidth);
    }
    if (type === 'polyline') {
      addingElement = buildPolyline([{ x: cursorX, y: cursorY }], defaultColor, defaultStrokeWidth);
    }
    if (type === 'polygon') {
      addingElement = buildPolygon([{ x: cursorX, y: cursorY }], defaultColor, defaultColor, defaultStrokeWidth);
    }
    if (type === 'path') {
      addingElement = buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, defaultColor, defaultStrokeWidth);
    }
    adding = true;
  }
}

export function modifyAddingElement(cursorX: number, cursorY: number): void {
  if (adding) {
    var type = addingElement.type;
    if (type === 'rect') {
      addingElement.width = cursorX - addingElement.x;
      addingElement.height = cursorY - addingElement.y;
    }
    if (type === 'circle') {
      addingElement.cx = (addingElement.x + cursorX) / 2;
      addingElement.cy = (addingElement.y + cursorY) / 2;
      addingElement.r = Math.sqrt(Math.pow(cursorX - addingElement.x, 2) + Math.pow(cursorY - addingElement.y, 2)) / 2;
    }
    if (type === 'ellipse') {
      addingElement.cx = (addingElement.x + cursorX) / 2;
      addingElement.cy = (addingElement.y + cursorY) / 2;
      addingElement.rx = cursorX - addingElement.x;
      addingElement.ry = cursorY - addingElement.y;
    }
    if (type === 'line') {
      addingElement.x2 = cursorX;
      addingElement.y2 = cursorY;
    }
    if (type === 'polyline') {
      addingElement.points.push({ x: cursorX, y: cursorY });
    }
    if (type === 'polygon') {
      addingElement.points.push({ x: cursorX, y: cursorY });
    }
    if (type === 'path') {
      addingElement.d.push({ type: 'L', x: cursorX, y: cursorY });
    }
  }
  console.log(new Date().getTime(), JSON.stringify(addingElement));
}

export function settleAddingElement(cursorX: number, cursorY: number): void {
  if (adding) {
    adding = false;
    modifyAddingElement(cursorX, cursorY);
    addingElement = null;
  }
}
