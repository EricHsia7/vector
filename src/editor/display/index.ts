import { renderPlaneAsXML } from '../../graphic/render/index';
import { addingShapePlane } from '../tools/add/shape.ts';

export function renderAddingShapePlane(): void {
  const addingShapePlaneElement: HTMLElement = document.querySelector('.css_editor .css_adding_shape_plane');
  var xml: string = renderPlaneAsXML(addingShapePlane, {
    flattenTransform: false,
    exceptID: false
  });
  addingShapePlaneElement.innerHTML = xml;
}
