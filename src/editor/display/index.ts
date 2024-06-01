import { renderPlaneAsXML } from '../../graphic/render/index';
import { editingVectorDocument } from '../index';
import { addingShapePlane } from '../tools/add/shape.ts';

export function renderAddingShapePlane(): void {
  const addingShapePlaneElement: HTMLElement = document.querySelector('.css_editor .css_adding_shape_plane');
  var xml: string = renderPlaneAsXML(addingShapePlane, {
    flattenTransform: false,
    exceptID: false
  });
  addingShapePlaneElement.innerHTML = xml;
}

export function renderEditorPlane(): void {
  const addingEditorPlaneElement: HTMLElement = document.querySelector('.css_editor .css_editor_plane');
  var xml: string = renderPlaneAsXML(editingVectorDocument.planes[0], {
    flattenTransform: false,
    exceptID: false
  });
  addingEditorPlaneElement.innerHTML = xml;
}
