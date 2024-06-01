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
