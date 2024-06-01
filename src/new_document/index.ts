const newDocumentElement: HTMLElement = document.querySelector('.css_new_document');

export function openNewDocument(): void {
  newDocumentElement.setAttribute('displayed', true);
}

export function closeNewDocument(): void {
  newDocumentElement.setAttribute('displayed', false);
}
