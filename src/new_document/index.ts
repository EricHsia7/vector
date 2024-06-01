import { createVectorDocument, openDocument, vectorDocument } from '../editor/index.ts';

const newDocumentElement: HTMLElement = document.querySelector('.css_new_document');
const newDocumentModalOverlayElement: HTMLElement = document.querySelector('.css_new_document_modal_overlay');

export function openNewDocument(): void {
  newDocumentElement.setAttribute('displayed', true);
  newDocumentModalOverlayElement.setAttribute('displayed', true);
}

export function closeNewDocument(): void {
  newDocumentElement.setAttribute('displayed', false);
  newDocumentModalOverlayElement.setAttribute('displayed', false);
}

export function createDocumentWithInputs(): void {
  const name: string = String(newDocumentElement.querySelector('#new_document_name')) || 'Untitled';
  const width: number = parseInt(newDocumentElement.querySelector('#new_document_width')) || 64;
  const height: number = parseInt(newDocumentElement.querySelector('#new_document_height')) || 64;
  var creation: vectorDocument = createVectorDocument(width, height, null, null, name);
  openDocument(creation.id);
}
