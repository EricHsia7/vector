import { editingVectorDocument } from '../../index';
import { elementType, stroke, strokeWidth } from '../../../graphic/attributes/index';
import { elements } from '../../../graphic/elements/index';
import { buildPlane, plane } from '../../../graphic/plane/index';
import { renderAddingPathPlane, renderEditorPlane } from '../../display/index';
import { currentViewHeight, currentViewWidth } from '../../index';
import { buildPath, smoothPath } from '../../../graphic/elements/path';

let addingPathElements: elements = [];
let addingPath: boolean = false;
export let addingPathPlane: plane = buildPlane(0, 0, 0, 0, true);

let currentStroke: stroke = '#888888';
let currentStrokeWidth: strokeWidth = 5;
let currentShapeType: elementType = 'path';

let currentPathType: 'mono' | 'fountain' = 'mono';

export function switchPenType(): void {}

export function addPathElement(cursorX: number, cursorY: number): void {
  if (!addingPath) {
    switch (currentPathType) {
      case 'mono':
        addingPathElements.push(buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, currentStroke, currentStrokeWidth));
        break;
      case 'fountain':
        addingPathElements.push(buildPath([{ type: 'M', x: cursorX, y: cursorY }], null, currentStroke, currentStrokeWidth));
        break;
      default:
        break;
    }

    addingPathPlane.width = currentViewWidth;
    addingPathPlane.height = currentViewHeight;
    addingPathPlane.elements = addingPathElements;
    renderAddingPathPlane();
    addingPath = true;
  }
}

export function modifyAddingPathElement(cursorX: number, cursorY: number): void {
  if (addingPath) {
    switch (currentPathType) {
      case 'mono':
        for (let addingPathElement of addingPathElements) {
          addingPathElement.d.push({ type: 'L', x: cursorX, y: cursorY });
        }
        break;
      case 'fountain':
        break;
      default:
        break;
    }

    addingPathPlane.elements = addingPathElements;
    renderAddingPathPlane();
  }
}

export function settleAddingPathElement(cursorX: number, cursorY: number): void {
  if (addingPath) {
    addingPath = false;
    modifyAddingPathElement(cursorX, cursorY);
    switch (currentPathType) {
      case 'mono':
        addingPathElements = addingPathElements.map((addingPathElement) => {
          return smoothPath(addingPathElement);
        });
        break;
      case 'fountain':
        break;
      default:
        break;
    }

    addingPathPlane.elements = addingPathElements;
    editingVectorDocument.planes[0].elements = editingVectorDocument.planes[0].elements.concat(addingPathPlane.elements);
    renderEditorPlane();
    addingPathPlane.elements = [];
    addingPathElements = [];
    renderAddingPathPlane();
  }
}
