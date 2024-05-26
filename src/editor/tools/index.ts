import { elementType } from '../../graphic/attributes';
import { addElement, modifyAddingElement, settleAddingElement } from './addElement.ts';

var defaultElementType: elementType = 'rect';

export function initializeTools(): void {
  const canvas = document.querySelector('#canvas');
  const eventsSet = [
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    ['mousedown', 'mousemove', 'mouseup', 'mouseout']
  ];

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const events = isTouchDevice ? eventsSet[0] : eventsSet[1];

  // Event listeners
  canvas.addEventListener(events[0], (e) => {
    var cursorX: number = 0;
    var cursorY: number = 0;
    if (isTouchDevice) {
      const touch = e.touches[0];
      cursorX = touch.clientX;
      cursorY = touch.clientY;
      e.preventDefault(); // Prevent scrolling
    } else {
      cursorX = e.offsetX;
      cursorY = e.offsetY;
    }
    addElement(cursorX, cursorY, defaultElementType);
  });

  canvas.addEventListener(events[1], (e) => {
    var cursorX: number = 0;
    var cursorY: number = 0;
    if (isTouchDevice) {
      const touch = e.touches[0];
      cursorX = touch.clientX;
      cursorY = touch.clientY;
      e.preventDefault(); // Prevent scrolling
    } else {
      cursorX = e.offsetX;
      cursorY = e.offsetY;
    }
    modifyAddingElement(cursorX, cursorY);
  });

  canvas.addEventListener(events[2], (e) => {
    var cursorX: number = 0;
    var cursorY: number = 0;
    if (isTouchDevice) {
      const touch = e.touches[0];
      cursorX = touch.clientX;
      cursorY = touch.clientY;
      e.preventDefault(); // Prevent scrolling
    } else {
      cursorX = e.offsetX;
      cursorY = e.offsetY;
    }
    settleAddingElement(cursorX, cursorY);
  });
  /*
  canvas.addEventListener(events[3], (e) => {
    var cursorX: number = 0;
    var cursorY: number = 0;
    if (isTouchDevice) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      cursorX = touch.clientX - rect.left;
      cursorY = touch.clientY - rect.top;
      e.preventDefault(); // Prevent scrolling
    } else {
      cursorX = e.offsetX;
      cursorY = e.offsetY;
    }
    settleAddingElement(cursorX, cursorY);
  });
  */
}
