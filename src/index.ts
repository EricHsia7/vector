import { createTransformationMatrix, transformPoints } from './graphic/transformation/index.ts';
import { buildRect } from './graphic/elements/rect.ts';
import { buildPlane } from './graphic/plane/index.ts';
import { renderPlaneAsXML } from './graphic/render/index.ts';

window.vector = {
  test: {
    createTransformationMatrix,
    transformPoints,
    r: function () {
      var plane0 = buildPlane(5, 40, 300, 300, true);
      var rect0 = buildRect(
        10,
        20,
        50,
        80,
        10,
        10,
        '#000',
        null,
        null,
        null,
        null,
        null,
        [
          { type: 'rotate', deg: 20 },
          { type: 'translate', x: 90, y: 40 }
        ],
        1,
        null
      );
      plane0.elements.push(rect0);
      var plane1 = buildPlane(5, 5, 60, 60, false, null, null);
      var rect1 = buildRect(5, 5, 50, 50, 5, 5, '#000');
      plane1.elements.push(rect1);
      plane0.subPlanes.push(plane1);
      console.log(
        renderPlaneAsXML(plane0, {
          flattenTransform: true
        })
      );
    }
  },
  initialize: function () {
    console.log(0);
  }
};

export default window.vector;
