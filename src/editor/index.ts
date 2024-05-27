import { id, width, height } from '../../graphic/attributes/index.ts';
import { plane } from '../../graphic/plane/index.ts';
import { uuidv4 } from '../../tools/index.ts';

export var vectorDocuments: object = {};
export var editingVectorDocumentID: string;

interface vectorDocument {
  width: width;
  height: height;
  planes: plane[];
  id: id;
  name: string;
  type: 'vectorDocument';
}

export function createVectorDocument(width: width, height: height, planes: plane[], id: id, name: string): vectorDocument {
  var object: vectorDocument = {
    width: width || 0,
    height: height || 0,
    planes: planes || [],
    id: id || `v_${uuidv4()}`,
    name: name || 'Untitled',
    type: 'vectorDocument'
  };
  vectorDocuments[object?.id] = object;
  return object;
}

export function resizeEditor(): void {
  const canvas: HTMLCanvasElement = document.querySelector('#canvas');
  const viewWidth: number = window.innerWidth;
  const viewHeight: number = window.innerHeight;
  canvas.width = viewWidth;
  canvas.height = viewHeight;
}

export function initializeEditor() {
  resizeEditor();
  //for development
  var d: vectorDocument = createVectorDocument(300, 300)
  editingVectorDocumentID = d.id
}
