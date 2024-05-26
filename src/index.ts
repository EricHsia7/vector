import { createTransformationMatrix, transformPoints } from './graphic/transformation/index.ts';
import { buildRect } from './graphic/elements/rect.ts';
import { buildPlane } from './graphic/plane/index.ts';
import { renderPlaneAsXML } from './graphic/render/index.ts';

window.vector = {
  test: {
    createTransformationMatrix,
    transformPoints,
    r: function () {
      var plane0 = buildPlane(0, 0, 300, 300);
      var rect0 = buildRect(10, 20, 50, 80, 15, 15, '#000');
      plane0.elements.push(rect0);
      console.log(renderPlaneAsXML(plane0));
    }
  },
  initialize: function () {
    console.log(0);
  }
};

export default window.vector;
