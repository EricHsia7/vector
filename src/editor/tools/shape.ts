import { editingVectorDocument } from '../index';
import { elementType, stroke, fill, strokeWidth } from '../../graphic/attributes/index';
import { elements } from '../../graphic/elements/index';
import { buildRect } from '../../graphic/elements/rect';
import { buildCircle } from '../../graphic/elements/circle';
import { buildEllipse } from '../../graphic/elements/ellipse';
import { buildLine } from '../../graphic/elements/line';
import { buildPolyline } from '../../graphic/elements/polyline';
import { buildPolygon } from '../../graphic/elements/polygon';
import { buildPlane, plane } from '../../graphic/plane/index';
import { renderAddingShapePlane, renderEditorPlane } from '../display/index';
import { currentViewHeight, currentViewWidth } from '../index';

let addingShapeElements: elements = [];
let addingShape: boolean = false;
export let addingShapePlane: plane = buildPlane(0, 0, 0, 0, true);

let currentFill: fill = '#000000';
let currentStroke: stroke = '#888888';
let currentStrokeWidth: strokeWidth = 3;
let currentShapeType: elementType = 'rect';

export function switchShapeType(): void {}

export function addShapeElement(cursorX: number, cursorY: number): void {
  if (!addingShape) {
    switch (currentShapeType) {
      case 'rect':
        addingShapeElements.push(buildRect(cursorX, cursorY, 0, 0, 0, 0, currentFill));
        break;
      case 'circle':
        addingShapeElements.push(buildCircle(cursorX, cursorY, cursorX, cursorY, 0, currentFill));
        break;
      case 'ellipse':
        addingShapeElements.push(buildEllipse(cursorX, cursorY, 0, 0, currentFill));
        break;
      case 'line':
        addingShapeElements.push(buildLine(cursorX, cursorY, cursorX, cursorY, currentStroke, currentStrokeWidth));
        break;
      case 'polyline':
        addingShapeElements.push(buildPolyline([{ x: cursorX, y: cursorY }], currentStroke, currentStrokeWidth));
        break;
      case 'polygon':
        addingShapeElements.push(buildPolygon([{ x: cursorX, y: cursorY }], currentFill, currentStroke, currentStrokeWidth));
        break;
      default:
        break;
    }
    addingShapePlane.width = currentViewWidth;
    addingShapePlane.height = currentViewHeight;
    addingShapePlane.elements = addingShapeElements;
    renderAddingShapePlane();
    addingShape = true;
  }
}

export function modifyAddingShapeElement(cursorX: number, cursorY: number): void {
  if (addingShape) {
    for (let addingShapeElement of addingShapeElements) {
      const type = addingShapeElement.type;
      switch (type) {
        case 'rect':
          addingShapeElement.width = cursorX - addingShapeElement.x;
          addingShapeElement.height = cursorY - addingShapeElement.y;
          break;
        case 'circle':
          addingShapeElement.cx = (addingShapeElement.x + cursorX) / 2;
          addingShapeElement.cy = (addingShapeElement.y + cursorY) / 2;
          addingShapeElement.r = Math.sqrt(Math.pow(cursorX - addingShapeElement.x, 2) + Math.pow(cursorY - addingShapeElement.y, 2)) / 2;
          break;
        case 'ellipse':
          addingShapeElement.cx = (addingShapeElement.x + cursorX) / 2;
          addingShapeElement.cy = (addingShapeElement.y + cursorY) / 2;
          addingShapeElement.rx = cursorX - addingShapeElement.x;
          addingShapeElement.ry = cursorY - addingShapeElement.y;
          break;
        case 'line':
          addingShapeElement.x2 = cursorX;
          addingShapeElement.y2 = cursorY;
          break;
        case 'polyline':
          addingShapeElement.points.push({ x: cursorX, y: cursorY });
          break;
        case 'polygon':
          addingShapeElement.points.push({ x: cursorX, y: cursorY });
          break;
        default:
          break;
      }
    }
    addingShapePlane.elements = addingShapeElements;
    renderAddingShapePlane();
  }
}

export function settleAddingShapeElement(cursorX: number, cursorY: number): void {
  if (addingShape) {
    addingShape = false;
    modifyAddingShapeElement(cursorX, cursorY);
    editingVectorDocument.planes[0].elements = editingVectorDocument.planes[0].elements.concat(addingShapePlane.elements);
    renderEditorPlane();
    addingShapePlane.elements = [];
    addingShapeElements = [];
    renderAddingShapePlane();
  }
}
