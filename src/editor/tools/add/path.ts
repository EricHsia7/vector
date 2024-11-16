import { editingVectorDocument } from '../../index';
import { elementType, stroke, strokeWidth } from '../../../graphic/attributes/index';
import { elements } from '../../../graphic/elements/index';
import { buildPlane, plane } from '../../../graphic/plane/index';
import { renderAddingPathPlane, renderEditorPlane } from '../../display/index';
import { currentViewHeight, currentViewWidth } from '../../index';
import { buildPath, smoothPath } from '../../../graphic/elements/path';

let addingPathElement: elements = [];
let addingPath: boolean = false;
export let addingPathPlane: plane = buildPlane(0, 0, 0, 0, true);

let currentStroke: stroke = '#000';
let currentStrokeWidth: strokeWidth = 3;
let currentShapeType: elementType = 'path';

let currentPenType: 'ballpen' | 'fountainpen' = 'ballpen';

export function switchPenType(): void {}

export function addPathElement(cursorX: number, cursorY: number): void {
  if (!addingPath) {
    switch (currentPenType) {
      case 'ballpen':
        addingPathElement = buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, currentStroke, currentStrokeWidth);
        break;
      case 'fountainpen':
        addingPathElement = buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, currentStroke, currentStrokeWidth);
        break;
      default:
        break;
    }
    addingPathPlane.width = currentViewWidth;
    addingPathPlane.height = currentViewHeight;
    addingPathPlane.elements = [addingPathElement];
    renderAddingPathPlane();
    addingPath = true;
  }
}

export function modifyAddingPathElement(cursorX: number, cursorY: number): void {
  if (addingPath) {
    switch (currentPenType) {
      case 'ballpen':
        addingPathElement.d.push({ type: 'L', x: cursorX, y: cursorY });
        break;
      case 'fountainpen':
        break;
      default:
        break;
    }

    addingPathPlane.elements = [addingPathElement];
    renderAddingPathPlane();
  }
  console.log(new Date().getTime(), JSON.stringify(addingPathElement));
}

export function settleAddingPathElement(cursorX: number, cursorY: number): void {
  if (addingPath) {
    addingPath = false;
    modifyAddingPathElement(cursorX, cursorY);
    addingPathElement = smoothPath(addingPathElement, 3);
    addingPathPlane.elements = [addingPathElement];
    editingVectorDocument.planes[0].elements = editingVectorDocument.planes[0].elements.concat(addingPathPlane.elements);
    renderEditorPlane();
    addingPathPlane.elements = [];
    addingPathElement = null;
    renderAddingPathPlane();
  }
}
