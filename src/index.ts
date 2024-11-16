import { createTransformationMatrix, transformPoints } from './graphic/transformation/index';
import { buildRect } from './graphic/elements/rect';
import { buildCircle } from './graphic/elements/circle';
import { buildPlane } from './graphic/plane/index';
import { renderPlaneAsXML } from './graphic/render/index';
import { initializeTools, switchTool } from './editor/tools/index';
import { initializeEditor } from './editor/index';
import { openNewDocument, closeNewDocument, createDocumentWithInputs } from './new_document/index';
import { switchShapeType } from './editor/tools/shape';

import './theme.css';
import './index.css';
import './home/index.css';
import './new_document/index.css';
import './editor/index.css';
import './editor/planes.css';
import './editor/tools/index.css';

window.vector = {
  test: {
    createTransformationMatrix,
    transformPoints,
    r: function () {
      var plane0 = buildPlane(0, 0, 300, 300, true);
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
      var circle0 = buildCircle(0, 0, 20, 20, 20, '#000', null, null, null, null, null, [{ type: 'scale', x: 1.5, y: 1.2 }], 0.8, null);
      plane1.elements.push(rect1);
      plane1.elements.push(circle0);
      plane0.subPlanes.push(plane1);
      console.log(JSON.stringify(plane0));
      console.log(
        renderPlaneAsXML(plane0, {
          flattenTransform: false,
          exceptID: false
        })
      );
    }
  },
  toolbar: {
    switchTool,
    switchShapeType
  },
  exports: {
    newDocument: {
      openNewDocument,
      closeNewDocument,
      createDocumentWithInputs
    }
  },
  initialize: function () {
    initializeTools();
    initializeEditor();
    console.log(0);
  }
};

export default window.vector;
