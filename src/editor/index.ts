import { id, width, height } from '../graphic/attributes/index';
import { buildPlane, plane } from '../graphic/plane/index';
import { uuidv4 } from '../utilities/index';

interface vectorDocument {
  width: width;
  height: height;
  planes: Array<plane>;
  id: id;
  name: string;
  type: 'vectorDocument';
}

export var editingVectorDocument: vectorDocument = {};
export var editingVectorDocumentID: string = '';

export var currentViewWidth: width = 0;
export var currentViewHeight: height = 0;

const editorElement: HTMLElement = document.querySelector('.css_editor');
const editorCanvasElement: HTMLCanvasElement = editorElement.querySelector('.css_editor_canvas');

export function createVectorDocument(width: width, height: height, planes: Array<plane>, id: id, name: string): vectorDocument {
  var object: vectorDocument = {
    width: width || 0,
    height: height || 0,
    planes: planes || [buildPlane(0, 0, width || 0, height || 0, true, null, null)],
    id: id || `v_${uuidv4()}`,
    name: name || 'Untitled',
    type: 'vectorDocument'
  };
  editingVectorDocument = object;
  editingVectorDocumentID = object.id;
  return object;
}

export function openEditor(): void {
  editorElement.setAttribute('displayed', true);
}

export function closeEditor(): void {
  editorElement.setAttribute('displayed', false);
}

export function openDocument(id: id): void {
  editingVectorDocumentID = id;
  openEditor();
}

export function resizeEditor(): void {
  currentViewWidth = window.innerWidth;
  currentViewHeight = window.innerHeight;
  editorCanvasElement.width = currentViewWidth;
  editorCanvasElement.height = currentViewHeight;
}

export function initializeEditor() {
  resizeEditor();
  window.addEventListener('resize', function () {
    resizeEditor();
  });
  if (window.screen) {
    window.screen.orientation.addEventListener('change', function () {
      resizeEditor();
    });
  }
}
