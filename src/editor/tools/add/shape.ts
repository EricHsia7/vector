import { editingVectorDocument, vectorDocument, editingVectorDocumentID } from '../../index';
import { elementType, stroke, fill, strokeWidth } from '../../../graphic/attributes/index';
import { elements } from '../../../graphic/elements/index';
import { buildRect } from '../../../graphic/elements/rect';
import { buildCircle } from '../../../graphic/elements/circle';
import { buildEllipse } from '../../../graphic/elements/ellipse';
import { buildLine } from '../../../graphic/elements/line';
import { buildPolyline } from '../../../graphic/elements/polyline';
import { buildPolygon } from '../../../graphic/elements/polygon';
import { buildPath } from '../../../graphic/elements/path';
import { buildPlane, plane } from '../../../graphic/plane/index';
import { renderAddingShapePlane, renderEditorPlane } from '../../display/index';
import { currentViewHeight, currentViewWidth } from '../../index';

var addingShapeElement: elements;
var addingShape: boolean = false;
export var addingShapePlane: plane = buildPlane(0, 0, 0, 0, true);

var currentFill: fill = '#000';
var currentStroke: stroke = '#000';
var currentStrokeWidth: strokeWidth = 3;
var currentShapeType: elementType = 'rect';

export function switchShapeType(): void {}

export function addShapeElement(cursorX: number, cursorY: number): void {
  if (!addingShape) {
    switch (currentShapeType) {
      case 'rect':
        addingShapeElement = buildRect(cursorX, cursorY, 0, 0, 0, 0, currentFill);
        break;
      case 'circle':
        addingShapeElement = buildCircle(cursorX, cursorY, cursorX, cursorY, 0, currentFill);
        break;
      case 'ellipse':
        addingShapeElement = buildEllipse(cursorX, cursorY, 0, 0, currentFill);
        break;
      case 'line':
        addingShapeElement = buildLine(cursorX, cursorY, cursorX, cursorY, currentStroke, currentStrokeWidth);
        break;
      case 'polyline':
        addingShapeElement = buildPolyline([{ x: cursorX, y: cursorY }], currentStroke, currentStrokeWidth);
        break;
      case 'polygon':
        addingShapeElement = buildPolygon([{ x: cursorX, y: cursorY }], currentFill, currentStroke, currentStrokeWidth);
        break;
      default:
        break;
    }
    addingShapePlane.width = currentViewWidth;
    addingShapePlane.height = currentViewHeight;
    addingShapePlane.elements = [addingShapeElement];
    renderAddingShapePlane();
    /*
    if (type === 'path') {
      addingShapeElement = buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, currentFill, currentStrokeWidth);
    }
    */
    addingShape = true;
  }
}

export function modifyAddingShapeElement(cursorX: number, cursorY: number): void {
  if (addingShape) {
    var type = addingShapeElement.type;
    if (type === 'rect') {
      addingShapeElement.width = cursorX - addingShapeElement.x;
      addingShapeElement.height = cursorY - addingShapeElement.y;
    }
    if (type === 'circle') {
      addingShapeElement.cx = (addingShapeElement.x + cursorX) / 2;
      addingShapeElement.cy = (addingShapeElement.y + cursorY) / 2;
      addingShapeElement.r = Math.sqrt(Math.pow(cursorX - addingShapeElement.x, 2) + Math.pow(cursorY - addingShapeElement.y, 2)) / 2;
    }
    if (type === 'ellipse') {
      addingShapeElement.cx = (addingShapeElement.x + cursorX) / 2;
      addingShapeElement.cy = (addingShapeElement.y + cursorY) / 2;
      addingShapeElement.rx = cursorX - addingShapeElement.x;
      addingShapeElement.ry = cursorY - addingShapeElement.y;
    }
    if (type === 'line') {
      addingShapeElement.x2 = cursorX;
      addingShapeElement.y2 = cursorY;
    }
    if (type === 'polyline') {
      addingShapeElement.points.push({ x: cursorX, y: cursorY });
    }
    if (type === 'polygon') {
      addingShapeElement.points.push({ x: cursorX, y: cursorY });
    }
    addingShapePlane.elements = [addingShapeElement];
    renderAddingShapePlane();
    /*
    if (type === 'path') {
      addingShapeElement.d.push({ type: 'L', x: cursorX, y: cursorY });
    }
    */
  }
  console.log(new Date().getTime(), JSON.stringify(addingShapeElement));
}

export function settleAddingShapeElement(cursorX: number, cursorY: number): void {
  if (addingShape) {
    addingShape = false;
    modifyAddingShapeElement(cursorX, cursorY);
    editingVectorDocument.planes[0].elements = editingVectorDocument.planes[0].elements.concat(addingShapePlane.elements);
    renderEditorPlane();
    addingShapePlane.elements = [];
    addingShapeElement = null;
    renderAddingShapePlane();
  }
}
