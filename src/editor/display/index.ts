import { renderPlaneAsXML } from '../../graphic/render/index';
import { editingVectorDocument } from '../index';
import { addingPathPlane } from '../tools/add/path';
import { addingShapePlane } from '../tools/add/shape';

export function renderAddingShapePlane(): void {
  const addingShapePlaneElement: HTMLElement = document.querySelector('.css_editor .css_adding_shape_plane');
  var xml: string = renderPlaneAsXML(addingShapePlane, {
    flattenTransform: false,
    exceptID: false
  });
  addingShapePlaneElement.innerHTML = xml;
}

export function renderAddingPathPlane(): void {
  const addingPathPlaneElement: HTMLElement = document.querySelector('.css_editor .css_adding_path_plane');
  var xml: string = renderPlaneAsXML(addingPathPlane, {
    flattenTransform: false,
    exceptID: false
  });
  addingPathPlaneElement.innerHTML = xml;
}

export function renderEditorPlane(): void {
  const addingEditorPlaneElement: HTMLElement = document.querySelector('.css_editor .css_editor_plane');
  var xml: string = renderPlaneAsXML(editingVectorDocument.planes[0], {
    flattenTransform: false,
    exceptID: false
  });
  addingEditorPlaneElement.innerHTML = xml;
}
