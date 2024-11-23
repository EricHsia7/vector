import { editingVectorDocument } from '../index';
import { elements } from '../../graphic/elements/index';
import { buildPlane, plane, searchElementOnPlane } from '../../graphic/plane/index';
import { renderAddingPathPlane, renderEditorPlane } from '../display/index';
import { currentViewHeight, currentViewWidth } from '../index';
import { id } from '../../graphic/attributes/index';
import { searchElementOnPlane } from '../../graphic/plane/index';

let selectedElements: elements = [];
let selectingElement: boolean = false;
export let selectedElementPlane: plane = buildPlane(0, 0, 0, 0, true);

export function selectElement(id: id, cursorX: number, cursorY: number): void {
  if (!selectingElement) {
    selectedElements = searchElementOnPlane(editingVectorDocument.planes[0]);
    selectedElementPlane.elements = selectedElements;
    selectedElementPlane.width = currentViewWidth;
    selectedElementPlane.height = currentViewHeight;
    selectedElementPlane.elements = selectedElements;
    renderSelectedElementPlane();
    selectingElement = true;
  }
}

export function modifySelectedElement(cursorX: number, cursorY: number): void {
  if (selectingElement) {
    selectedElementPlane.elements = selectedElements;
    renderAddingPathPlane();
  }
}

export function settleSelectedElement(cursorX: number, cursorY: number): void {
  if (selectingElement) {
    selectingElement = false;
    modifyAddingPathElement(cursorX, cursorY);

    selectedElementPlane.elements = selectedElements;
    renderEditorPlane();
    selectedElementPlane.elements = [];
    selectedElements = [];
    renderAddingPathPlane();
  }
}
